import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-search',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-search.html',
  styleUrl: './employee-search.css'
})
export class EmployeeSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeesApi = inject(EmployeeService);

  readonly results = signal<Employee[] | null>(null);
  readonly searching = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    designation: [''],
    department: ['']
  });

  search(): void {
    this.error.set(null);
    const d = this.form.controls.designation.value.trim();
    const dept = this.form.controls.department.value.trim();
    if (!d && !dept) {
      this.error.set('Enter at least designation or department.');
      return;
    }
    this.searching.set(true);
    this.results.set(null);
    this.employeesApi.search(d || undefined, dept || undefined).subscribe({
      next: (list) => {
        this.results.set(list);
        this.searching.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.searching.set(false);
      }
    });
  }
}
