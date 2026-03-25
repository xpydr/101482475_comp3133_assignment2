import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.css'
})
export class EmployeeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeesApi = inject(EmployeeService);

  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing employee id');
      this.loading.set(false);
      return;
    }
    this.employeesApi.getById(id).subscribe({
      next: (emp) => {
        this.employee.set(emp);
        this.loading.set(false);
        if (!emp) {
          this.error.set('Employee not found');
        }
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
