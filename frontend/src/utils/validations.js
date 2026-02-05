// Validation rules matching backend requirements

export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Name is required'
  }
  if (name.length < 20) {
    return 'Name must be at least 20 characters'
  }
  if (name.length > 60) {
    return 'Name must not exceed 60 characters'
  }
  return ''
}

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return ''
}

export const validatePassword = (password) => {
  if (!password || password === '') {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (password.length > 16) {
    return 'Password must not exceed 16 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return ''
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword === '') {
    return 'Please confirm your password'
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return ''
}

export const validateAddress = (address) => {
  // Address is optional, but if provided, check max length
  if (address && address.length > 400) {
    return 'Address must not exceed 400 characters'
  }
  return ''
}

export const validateRating = (rating) => {
  if (rating === null || rating === undefined || rating === '') {
    return 'Please select a rating'
  }
  const numRating = Number(rating)
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return 'Rating must be between 1 and 5'
  }
  return ''
}

// Complete form validation objects

export const validateRegisterForm = (formData) => {
  const errors = {}

  const nameError = validateName(formData.name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError

  const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword)
  if (confirmError) errors.confirmPassword = confirmError

  const addressError = validateAddress(formData.address)
  if (addressError) errors.address = addressError

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateLoginForm = (formData) => {
  const errors = {}

  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError

  if (!formData.password || formData.password === '') {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateCreateUserForm = (formData) => {
  const errors = {}

  const nameError = validateName(formData.name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError

  const addressError = validateAddress(formData.address)
  if (addressError) errors.address = addressError

  if (!formData.role) {
    errors.role = 'Please select a role'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateCreateStoreForm = (formData) => {
  const errors = {}

  const nameError = validateName(formData.name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError

  const addressError = validateAddress(formData.address)
  if (addressError) errors.address = addressError

  if (!formData.ownerId) {
    errors.ownerId = 'Please select a store owner'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validatePasswordChangeForm = (formData) => {
  const errors = {}

  if (!formData.currentPassword || formData.currentPassword === '') {
    errors.currentPassword = 'Current password is required'
  }

  const newPasswordError = validatePassword(formData.newPassword)
  if (newPasswordError) errors.newPassword = newPasswordError

  if (formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Helper to check password strength
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None', color: 'gray' }
  
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength <= 2) return { strength, label: 'Weak', color: 'red' }
  if (strength <= 4) return { strength, label: 'Medium', color: 'yellow' }
  return { strength, label: 'Strong', color: 'green' }
}

// Real-time validation helpers
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}