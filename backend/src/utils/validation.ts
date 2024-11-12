// validation.ts
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 6) errors.push('Le mot de passe doit contenir au moins 6 caractères');
  if (!/\d/.test(password)) errors.push('Le mot de passe doit contenir au moins un chiffre');
  return errors;
};