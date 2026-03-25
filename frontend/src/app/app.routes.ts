import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.SignupComponent)
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/employees-shell/employees-shell').then((m) => m.EmployeesShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/employee-list/employee-list').then((m) => m.EmployeeListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/employee-add/employee-add').then((m) => m.EmployeeAddComponent)
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/employee-search/employee-search').then((m) => m.EmployeeSearchComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/employee-edit/employee-edit').then((m) => m.EmployeeEditComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/employee-detail/employee-detail').then((m) => m.EmployeeDetailComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'employees' }
];
