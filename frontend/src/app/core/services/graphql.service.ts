import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface GraphQLErrorItem {
  message: string;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  request<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    return this.http
      .post<GraphQLResponse<T>>(environment.graphqlUrl, { query, variables }, { headers })
      .pipe(
        map((body) => {
          if (body.errors?.length) {
            throw new Error(body.errors[0].message);
          }
          if (body.data === undefined) {
            throw new Error('No data returned from server');
          }
          return body.data;
        })
      );
  }
}
