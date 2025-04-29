import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'environments/environment';
import { valuesys } from 'app/shared/models/options';
import { Auth } from 'app/shared/models/db';

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
                    this.setToken(response['data']['access_token'], response['data']['expires_in']);
                }
            })
        );
    }

    me() {
        return this.httpService.get<any>(`auth/me`).pipe(
            tap(async response => {
                console.log('User info response:', response);
                if (response['code'] === 200) {
                    await this.setLoginUser(response['data']['info']);
                    //await this.setToken(response['data']['access_token'], response['data']['expires_in']);
                }
            })
        );
    }

    /*
    * Code sous module un tableau ou un string | le premier element du tableau on ne renseigne pas son code de module
    * Mais le reste du table on doit renseignez leur code de module dans modules
    * */
    public initAutority(codeSousModule:string|Array<string>,modules:Array<string> = []){
        if(typeof codeSousModule === 'string'){
            codeSousModule = [codeSousModule]
        }

        modules.push(window['module'].toString())
        window['authority'] =[];
        window['actions'] = null;
        window['authority']['module'] = modules;
        window['authority']['sous_module'] = codeSousModule;
        let user:Auth ;
        user = <Auth> JSON.parse(localStorage.getItem(environment.userItemName) || null);
        window['authority']['user'] = user;
    }

    public setToken(token:string,expires_in:number){
        localStorage.setItem(environment.authItemName, token);
        let t = new Date();
        t.setSeconds(t.getSeconds() + (expires_in));
        localStorage.setItem(valuesys.timeTokenName, t.getTime() + "");
    }

    /*async refreshToken(){
        setTimeout(async ()=>{
            if(AuthService.refresh()){
            let {data,code} = await this.http.get(environment.baseUrl+environment.refresh,valuesys.httpAuthOptions()).toPromise();
            if(code === 200){
                this.setToken(data.access_token,data.expires_in)
            }
            }
        },70) 
    }*/

    private static refresh(){
        let timeToken_ =  +window.localStorage.getItem(valuesys.timeTokenName) || 0;
            let now = (new Date()).getTime();
            console.log((timeToken_ - now) / 1000 );
        return timeToken_ - now   <= valuesys.authRefreshInterval;
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