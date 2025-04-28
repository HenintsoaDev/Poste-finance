import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Translatable implements OnInit {

    showPassword:Boolean = false;

    constructor(private router: Router) {
      super();
    }

    ngOnInit(): void {
    }

    onLogin() {
        this.router.navigate(['/home']);
    }

    setShowPassword()
    {
        this.showPassword = !this.showPassword;
    }

}
