export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string | null;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender?: string | null;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string | null;
}

export type UpdateEmployeeInput = Partial<Omit<EmployeeInput, never>>;
