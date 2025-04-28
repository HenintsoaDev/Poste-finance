import { Component, OnInit } from '@angular/core';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent extends Translatable implements OnInit {

  constructor() { 
    super()
  }

  ngOnInit(): void { 
  }

}
