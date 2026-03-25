import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Employee, EmployeeInput, UpdateEmployeeInput } from '../models/employee.model';
import { GraphqlService } from './graphql.service';

interface GetAllEmployeesData {
  getAllEmployees: Employee[];
}

interface GetEmployeeData {
  getEmployeeById: Employee | null;
}

interface SearchEmployeesData {
  searchEmployees: Employee[];
}

interface AddEmployeeData {
  addEmployee: Employee;
}

interface UpdateEmployeeData {
  updateEmployee: Employee;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly gql = inject(GraphqlService);

  getAll(): Observable<Employee[]> {
    const query = `
      query GetAllEmployees {
        getAllEmployees {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          created_at
          updated_at
        }
      }
    `;
    return this.gql.request<GetAllEmployeesData>(query).pipe(map((d) => d.getAllEmployees));
  }

  getById(eid: string): Observable<Employee | null> {
    const query = `
      query GetEmployee($eid: ID!) {
        getEmployeeById(eid: $eid) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          created_at
          updated_at
        }
      }
    `;
    return this.gql
      .request<GetEmployeeData>(query, { eid })
      .pipe(map((d) => d.getEmployeeById));
  }

  search(designation?: string, department?: string): Observable<Employee[]> {
    const query = `
      query SearchEmployees($designation: String, $department: String) {
        searchEmployees(designation: $designation, department: $department) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          created_at
          updated_at
        }
      }
    `;
    return this.gql
      .request<SearchEmployeesData>(query, {
        designation: designation || null,
        department: department || null
      })
      .pipe(map((d) => d.searchEmployees));
  }

  add(input: EmployeeInput): Observable<Employee> {
    const query = `
      mutation AddEmployee($input: EmployeeInput!) {
        addEmployee(input: $input) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          created_at
          updated_at
        }
      }
    `;
    return this.gql.request<AddEmployeeData>(query, { input }).pipe(map((d) => d.addEmployee));
  }

  update(eid: string, input: UpdateEmployeeInput | Record<string, unknown>): Observable<Employee> {
    const query = `
      mutation UpdateEmployee($eid: ID!, $input: UpdateEmployeeInput!) {
        updateEmployee(eid: $eid, input: $input) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          date_of_joining
          department
          employee_photo
          created_at
          updated_at
        }
      }
    `;
    return this.gql
      .request<UpdateEmployeeData>(query, { eid, input })
      .pipe(map((d) => d.updateEmployee));
  }
}
