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
                if(res['code'] == 200) {
                    this.router.navigate(['/home']);
                    this.toastr.success(this.__("global.connecter"), this.__("global.success"));
                }else if(res['code'] == 403) {
                    if(res['data']['force_update']){
                        this.isResetPasswort = true;
                    }
                    this.toastr.error(res['msg'], this.__("global.error"));
                }
                else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }                
            },
            error: (err) => {
            }
        });
    }

    onResetPassword()
    {
        if(this.newPassword != this.confirmNewPassword) {
            this.toastr.error(this.__("global.mdp_non_identique"), 'Erreur');
            return;
        }
        this.authService.resetPassword({ old_password: this.oldPassword, new_password: this.newPassword }).subscribe({
            next: (res) => {
                
                if(res['code'] == 201) {
                    this.login = "";
                    this.password = "";
                    this.isResetPasswort = false;
                    this.toastr.success(res['msg'], this.__("global.success"));
                }else{
                    this.toastr.error(res['msg'], this.__("global.error"));
                }                
            },
            error: (err) => {
                this.toastr.error(this.__("global.connection_echec"), 'Erreur');
            }
        });
    }

}
