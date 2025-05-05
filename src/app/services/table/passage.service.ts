import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PassageEvent {
  type: any;
  data: any;
}

@Injectable({
  providedIn: 'root'
})



export class PassageService {

  // Créer un sujet pour notifier l'ouverture du modal
  private passageSubject = new BehaviorSubject<PassageEvent>({ type: '', data: null });  
  constructor() { }

  // Méthode pour ouvrir le modal avec des données spécifiques
  openModal(data: any) {
    this.passageSubject.next({ type: 'modal', data });
    
  }

  appelURL(data: any){
    this.passageSubject.next({ type: 'url', data });
  }

  // Méthode pour récupérer l'observable qui sera écouté dans l'autre composant
  getObservable() {
    return this.passageSubject.asObservable();
  }

  clear(): void {
    this.passageSubject.next({ type: 'cc', data: null });
  }
}
