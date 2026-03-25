import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css'
})
export class EmployeeEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly employeesApi = inject(EmployeeService);
  private readonly router = inject(Router);

  employeeId = '';

  readonly loading = signal(true);
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
  replacePhoto = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing employee id');
      this.loading.set(false);
      return;
    }
    this.employeeId = id;
    this.employeesApi.getById(id).subscribe({
      next: (emp) => {
        this.loading.set(false);
        if (!emp) {
          this.error.set('Employee not found');
          return;
        }
        const d = new Date(emp.date_of_joining);
        const localYmd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        this.form.patchValue({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender ?? '',
          designation: emp.designation,
          salary: emp.salary,
          date_of_joining: localYmd,
          department: emp.department
        });
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.photoDataUrl = null;
      this.replacePhoto = false;
      return;
    }
    this.replacePhoto = true;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoDataUrl = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    this.error.set(null);
    if (this.form.invalid || !this.employeeId) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const dateStr = v.date_of_joining
      ? new Date(v.date_of_joining + 'T12:00:00').toISOString()
      : '';

    const input: Record<string, unknown> = {
      first_name: v.first_name.trim(),
      last_name: v.last_name.trim(),
      email: v.email.trim(),
      designation: v.designation.trim(),
      salary: Number(v.salary),
      date_of_joining: dateStr,
      department: v.department.trim()
    };
    const g = v.gender?.trim();
    input['gender'] = g ? g : null;
    if (this.replacePhoto && this.photoDataUrl) {
      input['employee_photo'] = this.photoDataUrl;
    }

    this.submitting.set(true);
    this.employeesApi.update(this.employeeId, input).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/employees', this.employeeId]);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}
