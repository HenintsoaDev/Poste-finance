import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Auth } from 'app/shared/models/db';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';
import Swal from 'sweetalert2';

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
  public user    : Auth = new Auth();

  constructor(private authService: AuthService, private toastr: ToastrService) { 
    super()
  }

  async ngOnInit() { 
    this.user = <Auth> await  this.authService.getLoginUser();
    console.log("xxxxxx", this.user);
  }

  onResetPassword()
  {
      if(this.newPassword != this.confirmNewPassword) {
          this.toastr.error(this.__("global.mdp_non_identique"), 'Erreur');
          return;
      }

      Swal.fire({
        title: this.__("global.confirmation"),
        text: this.__("global.modifier_mdp_?"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.__("global.oui_modifier"),
        cancelButtonText: this.__("global.cancel"),
        allowOutsideClick: false,
        customClass: {
            confirmButton: 'swal-button--confirm-custom',
            cancelButton: 'swal-button--cancel-custom'
        },
        }).then((result) => {
        if (result.isConfirmed) {
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
    });


    
  }

}
