import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SoldeService {
    
    private walletSoldeSubject = new BehaviorSubject<number>(0);
    private carteSoldeSubject = new BehaviorSubject<number>(0);

    walletSolde$ = this.walletSoldeSubject.asObservable();
    carteSolde$ = this.carteSoldeSubject.asObservable();

    constructor(private httpService: HttpService) {}

    getSoldeUser(){
        return this.httpService.get<any>(environment.getSoldeUser).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                    this.walletSoldeSubject.next(response['data']['solde']);
                    this.carteSoldeSubject.next(response['data']['solde_carte']);
                }
            })
        );
    }

    setWalletSolde(newValue: number) {
        this.walletSoldeSubject.next(newValue);
    }

    setCarteSolde(newValue: number) {
        this.carteSoldeSubject.next(newValue);
    }

    getWalletSolde(): number {
        return this.walletSoldeSubject.value;
    }

    getCarteSolde(): number {
        return this.carteSoldeSubject.value;
    }
}
