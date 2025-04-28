import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Translatable } from 'shared/constants/Translatable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Translatable implements OnInit {

    login = '';
    password = '';
    isResetPasswort: Boolean = false;
    oldPassword = '';
    newPassword = '';
    confirmNewPassword = '';

    showPassword:Boolean = false;
    showOldPassword:Boolean = false;
    showNewPassword:Boolean = false;
    showConfirmPassword:Boolean = false;

    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,
        ) {
        super();
    }

    ngOnInit(): void {}

    onLogin() {
        this.authService.login({ login: this.login, password: this.password }).subscribe({
            next: (res) => {
                console.log('Logged in!', res);
                if(res['code'] == 200) {
                    this.router.navigate(['/home']);
                    this.toastr.success("Connecté", 'Erreur');
                }if(res['code'] == 403) {
                    if(res['data']['force_update']){
                        this.isResetPasswort = true;
                    }
                    this.toastr.error(res['msg'], 'Erreur');
                }
                else{
                    this.toastr.error(res['msg'], 'Erreur');
                }                
            },
            error: (err) => {
                console.error('Login failed', err);
            }
        });
    }

    onResetPassword()
    {
        if(this.newPassword != this.confirmNewPassword) {
            this.toastr.error("Les mots de passe ne correspondent pas", 'Erreur');
            return;
        }
        this.authService.resetPassword({ old_password: this.oldPassword, new_password: this.newPassword }).subscribe({
            next: (res) => {
                
                if(res['code'] == 201) {
                    this.login = "";
                    this.password = "";
                    this.isResetPasswort = false;
                    this.toastr.success(res['msg'], 'Succès');
                }else{
                    this.toastr.error(res['msg'], 'Erreur');
                }                
            },
            error: (err) => {
                this.toastr.error("Connexion échouée", 'Erreur');
            }
        });
    }

}
