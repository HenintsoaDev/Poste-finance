import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private httpService: HttpService) {}

    login(credentials: { login: string, password: string }): Observable<any> {
        return this.http.post<any>(`${environment.baseUrl}/auth/loginAgence`, $.param(credentials),{
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Accept', 'application/json'),
            withCredentials: true
        }).pipe(
            tap(response => {
                console.log('Login response:', response);
                if (response['code'] === 200 || response['code'] === 403) {
                    localStorage.setItem(environment.authItemName, response['data']['access_token']);
                }
            })
        );
    }

    me() {
        return this.httpService.get<any>(`auth/me`).pipe(
            tap(async response => {
                console.log('User info response:', response);
                if (response['code'] === 200) {
                    localStorage.setItem(environment.authItemName, response['data']['access_token']);
                    await this.setLoginUser(response['data']['info']);
                }
            })
        );
    }

    public setToken(token:string,expires_in:number){
        localStorage.setItem(environment.authItemName, token);
        let t = new Date();
        t.setSeconds(t.getSeconds() + (expires_in));
        localStorage.setItem(valuesys.timeTokenName, t.getTime() + "");
    }

    private async setLoginUser(user:any){
        try {
            if(user){
                localStorage.setItem(environment.userItemName, JSON.stringify(user));
                return  true  
            }
            return false ;
        } catch (e) {
            return  false ;
        } 
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