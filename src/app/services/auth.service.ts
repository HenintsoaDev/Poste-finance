import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private authUrl = 'https://ws-distributeur.preprod-paositra.com';

    constructor(private http: HttpClient) {}

    login(credentials: { login: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.authUrl}/auth/loginAgence`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }
}