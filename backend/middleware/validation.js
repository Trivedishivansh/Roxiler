const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    handleValidationErrors
  ],
  
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    handleValidationErrors
  ],
  
  updatePassword: [
    body('currentPassword').notEmpty(),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    handleValidationErrors
  ],
  
  createUser: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('role')
      .isIn(['System Administrator', 'Normal User', 'Store Owner'])
      .withMessage('Invalid role specified'),
    handleValidationErrors
  ]
};

const storeValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Store name must be between 20 and 60 characters'),
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 }),
    body('ownerId')
      .isInt()
      .withMessage('Valid owner ID is required'),
    handleValidationErrors
  ],
  
  search: [
    query('name').optional().trim(),
    query('address').optional().trim(),
    query('sortBy').optional().isIn(['name', 'email', 'address', 'averageRating', 'createdAt']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    handleValidationErrors
  ]
};

const ratingValidation = {
  submit: [
    body('storeId').isInt().withMessage('Valid store ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    handleValidationErrors
  ],
  
  update: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    handleValidationErrors
  ]
};

module.exports = {
  userValidation,
  storeValidation,
  ratingValidation,
  handleValidationErrors
};