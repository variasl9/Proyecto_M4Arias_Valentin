import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../src/services/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('token-falso'),
    },
  },
}));

import { sendTasksSummary } from '../src/services/emailService';

describe('sendTasksSummary', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('llama al endpoint con el token de Firebase', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);

    await sendTasksSummary();

    expect(fetchMock).toHaveBeenCalledWith('/api/send-summary', {
      method: 'POST',
      headers: { Authorization: 'Bearer token-falso' },
    });
  });

  it('lanza un error si el servidor responde con falla', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Falló SES' }),
      }),
    );

    await expect(sendTasksSummary()).rejects.toThrow('Falló SES');
  });
});