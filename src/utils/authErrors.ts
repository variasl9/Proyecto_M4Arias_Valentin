const messages: Record<string, string> = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo más tarde.',
};

export function getAuthErrorMessage(code: string): string {
  return messages[code] ?? 'Ocurrió un error inesperado. Intentá de nuevo.';
}