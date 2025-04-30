import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent extends Translatable implements OnInit {


/***************************************** */
endpoint = "";
header = [
  {
    "nomColonne" : "Name",
    "colonneTable" : "name",
    "table" : "module"
  },
  {
    "nomColonne" : "Code",
    "colonneTable" : "code",
    "table" : "module"
  },
  {
    "nomColonne" : "Icon",
    "colonneTable" : "icon",
    "table" : "module"
  },

  
 
]

objetBody = [
        {
          'name' : 'name',
          'type' : 'text',
        },
        {
          'name' : 'code',
          'type' : 'text',
        },
        {
          'name' : 'icon',
          'type' : 'text',
        },
      
]
listIcon = []

searchGlobal = ['module.name', 'module.code', 'module.icon']
 
@ViewChild('saisirCIN') saisirCIN: TemplateRef<any> | undefined;
  minlength: number = 12;
  maxlength: number = 12;
 
/***************************************** */


  constructor() {
    super();
   }

  async ngOnInit() {

     /***************************************** */
    
        // Écouter les changements de modal à travers le service si il y a des actions
            
        this.endpoint = environment.module;
    /***************************************** */
  }

}
