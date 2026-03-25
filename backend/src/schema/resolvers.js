const User = require('../models/User');
const Employee = require('../models/Employee');
const { generateToken, authenticateUser } = require('../utils/auth');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const {
  validateSignupInput,
  validateLoginInput,
  validateEmployeeInput
} = require('../utils/validation');

const resolvers = {
  Query: {
    // Login query
    login: async (_, { usernameOrEmail, password }) => {
      try {
        validateLoginInput(usernameOrEmail, password);

        // Find user by username or email
        const user = await User.findOne({
          $or: [
            { username: usernameOrEmail },
            { email: usernameOrEmail }
          ]
        });

        if (!user) {
          throw new Error('Invalid username/email or password');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new Error('Invalid username/email or password');
        }

        const token = generateToken(user);

        return {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString()
          }
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Get all employees
    getAllEmployees: async (_, __, context) => {
      try {
        await authenticateUser(context);

        const employees = await Employee.find().sort({ created_at: -1 });
        
        return employees.map(employee => ({
          id: employee._id.toString(),
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining.toISOString(),
          department: employee.department,
          employee_photo: employee.employee_photo,
          created_at: employee.created_at.toISOString(),
          updated_at: employee.updated_at.toISOString()
        }));
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Get employee by ID
    getEmployeeById: async (_, { eid }, context) => {
      try {
        await authenticateUser(context);

        const employee = await Employee.findById(eid);
        
        if (!employee) {
          throw new Error('Employee not found');
        }

        return {
          id: employee._id.toString(),
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining.toISOString(),
          department: employee.department,
          employee_photo: employee.employee_photo,
          created_at: employee.created_at.toISOString(),
          updated_at: employee.updated_at.toISOString()
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Search employees by designation or department
    searchEmployees: async (_, { designation, department }, context) => {
      try {
        await authenticateUser(context);

        const query = {};
        
        if (designation) {
          query.designation = { $regex: designation, $options: 'i' };
        }
        
        if (department) {
          query.department = { $regex: department, $options: 'i' };
        }

        if (Object.keys(query).length === 0) {
          throw new Error('Please provide at least one search parameter (designation or department)');
        }

        const employees = await Employee.find(query).sort({ created_at: -1 });

        return employees.map(employee => ({
          id: employee._id.toString(),
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining.toISOString(),
          department: employee.department,
          employee_photo: employee.employee_photo,
          created_at: employee.created_at.toISOString(),
          updated_at: employee.updated_at.toISOString()
        }));
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  Mutation: {
    // Signup mutation
    signup: async (_, { username, email, password }) => {
      try {
        validateSignupInput(username, email, password);

        const existingUser = await User.findOne({
          $or: [
            { username },
            { email }
          ]
        });

        if (existingUser) {
          if (existingUser.username === username) {
            throw new Error('Username already exists');
          }
          if (existingUser.email === email) {
            throw new Error('Email already exists');
          }
        }

        const user = new User({
          username,
          email,
          password
        });

        await user.save();

        const token = generateToken(user);

        return {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString()
          }
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Add new employee
    addEmployee: async (_, { input }, context) => {
      try {
        await authenticateUser(context);
        validateEmployeeInput(input, false);

        const existingEmployee = await Employee.findOne({ email: input.email });
        if (existingEmployee) {
          throw new Error('Employee with this email already exists');
        }

        let photoUrl = null;
        if (input.employee_photo) {
          photoUrl = await uploadImage(input.employee_photo);
        }

        const employee = new Employee({
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          gender: input.gender,
          designation: input.designation,
          salary: input.salary,
          date_of_joining: new Date(input.date_of_joining),
          department: input.department,
          employee_photo: photoUrl
        });

        await employee.save();

        return {
          id: employee._id.toString(),
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining.toISOString(),
          department: employee.department,
          employee_photo: employee.employee_photo,
          created_at: employee.created_at.toISOString(),
          updated_at: employee.updated_at.toISOString()
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Update employee
    updateEmployee: async (_, { eid, input }, context) => {
      try {
        await authenticateUser(context);
        validateEmployeeInput(input, true);

        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error('Employee not found');
        }

        if (input.email && input.email !== employee.email) {
          const existingEmployee = await Employee.findOne({ email: input.email });
          if (existingEmployee) {
            throw new Error('Employee with this email already exists');
          }
        }

        if (input.employee_photo) {
          if (employee.employee_photo) {
            await deleteImage(employee.employee_photo);
          }
          input.employee_photo = await uploadImage(input.employee_photo);
        }

        if (input.first_name !== undefined) employee.first_name = input.first_name;
        if (input.last_name !== undefined) employee.last_name = input.last_name;
        if (input.email !== undefined) employee.email = input.email;
        if (input.gender !== undefined) employee.gender = input.gender;
        if (input.designation !== undefined) employee.designation = input.designation;
        if (input.salary !== undefined) employee.salary = input.salary;
        if (input.date_of_joining !== undefined) employee.date_of_joining = new Date(input.date_of_joining);
        if (input.department !== undefined) employee.department = input.department;
        if (input.employee_photo !== undefined) employee.employee_photo = input.employee_photo;

        await employee.save();

        return {
          id: employee._id.toString(),
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining.toISOString(),
          department: employee.department,
          employee_photo: employee.employee_photo,
          created_at: employee.created_at.toISOString(),
          updated_at: employee.updated_at.toISOString()
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Delete employee
    deleteEmployee: async (_, { eid }, context) => {
      try {
        await authenticateUser(context);

        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error('Employee not found');
        }

        if (employee.employee_photo) {
          await deleteImage(employee.employee_photo);
        }

        await Employee.findByIdAndDelete(eid);

        return {
          id: employee._id.toString(),
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining.toISOString(),
          department: employee.department,
          employee_photo: employee.employee_photo,
          created_at: employee.created_at.toISOString(),
          updated_at: employee.updated_at.toISOString()
        };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
};

module.exports = resolvers;
