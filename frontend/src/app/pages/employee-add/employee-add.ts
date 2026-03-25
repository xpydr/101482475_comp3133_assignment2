import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css'
})
export class EmployeeAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeesApi = inject(EmployeeService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: [''],
    designation: ['', Validators.required],
    salary: [1000, [Validators.required, Validators.min(1000)]],
    date_of_joining: ['', Validators.required],
    department: ['', Validators.required]
  });

  photoDataUrl: string | null = null;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.photoDataUrl = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.photoDataUrl = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const dateStr = v.date_of_joining
      ? new Date(v.date_of_joining + 'T12:00:00').toISOString()
      : '';

    this.submitting.set(true);
    this.employeesApi
      .add({
        first_name: v.first_name.trim(),
        last_name: v.last_name.trim(),
        email: v.email.trim(),
        gender: v.gender?.trim() || null,
        designation: v.designation.trim(),
        salary: Number(v.salary),
        date_of_joining: dateStr,
        department: v.department.trim(),
        employee_photo: this.photoDataUrl || null
      })
      .subscribe({
        next: (emp) => {
          this.submitting.set(false);
          this.router.navigate(['/employees', emp.id]);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.submitting.set(false);
        }
      });
  }
}
