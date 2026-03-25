const validator = require('validator');

/**
 * Validate email format
 */
const validateEmail = (email) => {
  if (!email) {
    throw new Error('Email is required');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
  return true;
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  return true;
};

/**
 * Validate gender enum values
 */
const validateGender = (gender) => {
  if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
    throw new Error('Gender must be one of: Male, Female, Other');
  }
  return true;
};

/**
 * Validate employee input data
 */
const validateEmployeeInput = (input, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!input.first_name || input.first_name.trim() === '') {
      errors.push('First name is required');
    }
    if (!input.last_name || input.last_name.trim() === '') {
      errors.push('Last name is required');
    }
    if (!input.email || input.email.trim() === '') {
      errors.push('Email is required');
    } else {
      try {
        validateEmail(input.email);
      } catch (error) {
        errors.push(error.message);
      }
    }
    if (!input.designation || input.designation.trim() === '') {
      errors.push('Designation is required');
    }
    if (input.salary === undefined || input.salary === null) {
      errors.push('Salary is required');
    } else if (typeof input.salary !== 'number' || input.salary < 1000) {
      errors.push('Salary must be a number and at least 1000');
    }
    if (!input.date_of_joining) {
      errors.push('Date of joining is required');
    }
    if (!input.department || input.department.trim() === '') {
      errors.push('Department is required');
    }
  } else {
    if (input.email !== undefined && input.email !== null) {
      try {
        validateEmail(input.email);
      } catch (error) {
        errors.push(error.message);
      }
    }
    if (input.salary !== undefined && input.salary !== null) {
      if (typeof input.salary !== 'number' || input.salary < 1000) {
        errors.push('Salary must be a number and at least 1000');
      }
    }
  }

  if (input.gender !== undefined && input.gender !== null) {
    try {
      validateGender(input.gender);
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};

/**
 * Validate signup input
 */
const validateSignupInput = (username, email, password) => {
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push('Username is required');
  }
  
  try {
    validateEmail(email);
  } catch (error) {
    errors.push(error.message);
  }

  try {
    validatePassword(password);
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};

/**
 * Validate login input
 */
const validateLoginInput = (usernameOrEmail, password) => {
  if (!usernameOrEmail || usernameOrEmail.trim() === '') {
    throw new Error('Username or email is required');
  }
  if (!password || password.trim() === '') {
    throw new Error('Password is required');
  }
  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateGender,
  validateEmployeeInput,
  validateSignupInput,
  validateLoginInput
};
