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

    showPassword:Boolean = false;
    login = '';
    password = '';

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

                }else{
                    this.toastr.error(res['msg'], 'Erreur');

                }                
            },
            error: (err) => {

                console.error('Login failed', err);
            }
        });
    }

    setShowPassword()
    {
        this.showPassword = !this.showPassword;
    }

}
