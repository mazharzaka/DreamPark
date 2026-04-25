export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordStrict = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Auth.errors.passwordLength');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Auth.errors.passwordUppercase');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Auth.errors.passwordNumber');
  }
  if (!/[!@#$%^&*()_+{}:"<>?]/.test(password)) {
    errors.push('Auth.errors.passwordSpecial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
