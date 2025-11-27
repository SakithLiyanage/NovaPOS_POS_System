export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  min: (minValue) => (value) => {
    if (value === '' || value === null || value === undefined) return null;
    if (Number(value) < minValue) {
      return `Must be at least ${minValue}`;
    }
    return null;
  },

  max: (maxValue) => (value) => {
    if (value === '' || value === null || value === undefined) return null;
    if (Number(value) > maxValue) {
      return `Must be no more than ${maxValue}`;
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Invalid phone number';
    }
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  },

  confirmPassword: (password) => (value) => {
    if (!value) return null;
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },

  positiveNumber: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    if (Number(value) <= 0) {
      return 'Must be a positive number';
    }
    return null;
  },
};

export const validate = (value, ...validatorFns) => {
  for (const fn of validatorFns) {
    const error = fn(value);
    if (error) return error;
  }
  return null;
};

export default validators;
