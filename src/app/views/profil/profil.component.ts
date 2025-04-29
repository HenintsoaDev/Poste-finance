import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent extends Translatable implements OnInit {

  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  showPassword:Boolean = false;
  showOldPassword:Boolean = false;
  showNewPassword:Boolean = false;
  showConfirmPassword:Boolean = false;

  constructor(private authService: AuthService, private toastr: ToastrService) { 
    super()
  }

  ngOnInit(): void { 
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
