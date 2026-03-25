import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'ems_auth_token';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  login: {
    token: string;
    user: AuthUser;
  };
}

interface SignupResponse {
  signup: {
    token: string;
    user: AuthUser;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly authState = signal(!!localStorage.getItem(TOKEN_KEY));
  readonly isLoggedIn = this.authState.asReadonly();

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.authState.set(false);
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.authState.set(true);
  }

  login(usernameOrEmail: string, password: string): Observable<void> {
    const query = `
      query Login($usernameOrEmail: String!, $password: String!) {
        login(usernameOrEmail: $usernameOrEmail, password: $password) {
          token
          user {
            id
            username
            email
            created_at
            updated_at
          }
        }
      }
    `;
    return this.postUnauthenticated<LoginResponse>(query, {
      usernameOrEmail,
      password
    }).pipe(
      tap((data) => this.setToken(data.login.token)),
      map(() => undefined)
    );
  }

  signup(username: string, email: string, password: string): Observable<void> {
    const query = `
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          user {
            id
            username
            email
            created_at
            updated_at
          }
        }
      }
    `;
    return this.postUnauthenticated<SignupResponse>(query, {
      username,
      email,
      password
    }).pipe(
      tap((data) => this.setToken(data.signup.token)),
      map(() => undefined)
    );
  }

  private postUnauthenticated<T>(
    query: string,
    variables: Record<string, unknown>
  ): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<{ data?: T; errors?: { message: string }[] }>(
        environment.graphqlUrl,
        { query, variables },
        { headers }
      )
      .pipe(
        map((body) => {
          if (body.errors?.length) {
            throw new Error(body.errors[0].message);
          }
          if (!body.data) {
            throw new Error('No data returned from server');
          }
          return body.data;
        })
      );
  }
}
