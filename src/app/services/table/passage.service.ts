import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassageService {

  // Créer un sujet pour notifier l'ouverture du modal
  private passageSubject = new BehaviorSubject<string>(''); // Valeur initiale vide
  
  constructor() { }

  // Méthode pour ouvrir le modal avec des données spécifiques
  openModal(data: any) {
    this.passageSubject.next(data);
  }

  appelURL(data: any){
    this.passageSubject.next(data);
  }

  // Méthode pour récupérer l'observable qui sera écouté dans l'autre composant
  getObservable() {
    return this.passageSubject.asObservable();
  }
}
