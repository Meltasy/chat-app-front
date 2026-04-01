interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

interface RegisterErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const USERNAME_REGEX = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/

function validateLoginForm(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {}
  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!password.trim()) {
    errors.password = 'Password is required.'
  }
  return errors
}

function validateRegisterForm(form: {
  username: string
  email: string
  password: string
  confirmPassword: string
}): RegisterErrors {
    const errors: RegisterErrors = {}
    if (!form.username.trim()) {
      errors.username = 'Username is required.'
    } else if (form.username.length < 6 || form.username.length > 100) {
      errors.username = 'Username must be between 6 and 100 characters.'
    } else if (!USERNAME_REGEX.test(form.username.trim())) {
      errors.username = 'Username must contain only letters with single spaces between words.'
    }
    if (!form.email.trim()) {
      errors.email = 'Email is required.'
    } else if (form.email.length > 100) {
      errors.email = 'Email must not exceed 100 characters.'
    } else if (!EMAIL_REGEX.test(form.email)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!form.password) {
      errors.password = 'Password is required.'
    } else if (!PASSWORD_REGEX.test(form.password)) {
      errors.password = 'Password must contain one number, one lowercase letter, one uppercase letter, one special character, no spaces, and be between 8 and 24 characters.'
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }
    return errors
  }

  export type {
    LoginErrors,
    RegisterErrors
  }

  export {
    validateLoginForm,
    validateRegisterForm
  }
