import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'app/services/breadcrumb.service';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends Translatable implements OnInit {

  constructor(public breadcrumbService: BreadcrumbService) { 
    super();
  }

  ngOnInit(): void {
  }

  goTo(){
    
  }

}
