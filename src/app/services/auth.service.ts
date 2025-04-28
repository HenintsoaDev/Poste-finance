import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private authUrl = 'https://ws-distributeur.preprod-paositra.com';

    constructor(private http: HttpClient, private httpService: HttpService) {}

    login(credentials: { login: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.authUrl}/auth/loginAgence`, credentials).pipe(
            tap(response => {
                if (response['code'] === 200 || response['code'] === 403) {
                    localStorage.setItem('access_token', response['data']['access_token']);
                }
            })
        );
    }

    resetPassword(credentials: { old_password: string, new_password: string }): Observable<any> {
        console.log('Resetting password with credentials:', credentials);
        console.log('TOKEN:', localStorage.getItem('access_token'));
        return this.httpService.post<any>(`parametrage/user/updateUserPassword`, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    localStorage.setItem('access_token', response['data']['access_token']);
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