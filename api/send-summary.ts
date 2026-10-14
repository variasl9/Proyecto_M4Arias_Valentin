import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface TaskData {
  title: string;
  description: string;
  completed: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    if (!decoded.email) {
      return res.status(400).json({ error: 'Tu cuenta no tiene email.' });
    }

    const snapshot = await getFirestore()
      .collection('tasks')
      .where('userId', '==', decoded.uid)
      .get();
    const tasks = snapshot.docs.map((d) => d.data() as TaskData);

    const done = tasks.filter((t) => t.completed);
    const pending = tasks.filter((t) => !t.completed);

    const text = [
      `Resumen de tus tareas (${tasks.length} en total)`,
      `Completadas: ${done.length} | Pendientes: ${pending.length}`,
      '',
      ...tasks.map((t) => `[${t.completed ? 'x' : ' '}] ${t.title}`),
    ].join('\n');

    const html = `
      <h2>Resumen de tus tareas</h2>
      <p>Total: ${tasks.length} · Completadas: ${done.length} · Pendientes: ${pending.length}</p>
      <ul>${tasks
        .map(
          (t) =>
            `<li>${t.completed ? '✅' : '⬜'} <strong>${escapeHtml(t.title)}</strong></li>`,
        )
        .join('')}</ul>`;

    await ses.send(
      new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL,
        Destination: { ToAddresses: [decoded.email] },
        Message: {
          Subject: { Data: 'Resumen de tus tareas - MateCode' },
          Body: { Text: { Data: text }, Html: { Data: html } },
        },
      }),
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error en send-summary:', error);
    return res.status(500).json({ error: 'No se pudo enviar el email.' });
  }
}