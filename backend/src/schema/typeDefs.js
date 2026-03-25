const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String!
    updated_at: String!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String!
    updated_at: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    login(usernameOrEmail: String!, password: String!): AuthPayload
    getAllEmployees: [Employee!]!
    getEmployeeById(eid: ID!): Employee
    searchEmployees(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    addEmployee(input: EmployeeInput!): Employee
    updateEmployee(eid: ID!, input: UpdateEmployeeInput!): Employee
    deleteEmployee(eid: ID!): Employee
  }
`;

module.exports = typeDefs;
