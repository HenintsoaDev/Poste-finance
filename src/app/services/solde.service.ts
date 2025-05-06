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
                    //this.walletSoldeSubject.next(response['data']['solde']);
                    //this.carteSoldeSubject.next(response['data']['solde_carte']);
                    localStorage.setItem('soldeWallet',response['data']['solde']);
                    localStorage.setItem('soldeCarte',response['data']['solde_carte']);

                    const localStorageValue = localStorage.getItem('soldeWallet');
                    if (localStorageValue) {
                        const parsedValue = parseFloat(localStorageValue);
                        if (!isNaN(parsedValue)) {
                            this.walletSoldeSubject.next(parsedValue);
                        }
                    }

                    const localStorageValueCarte = localStorage.getItem('soldeCarte');
                    if (localStorageValueCarte) {
                        const parsedValueCarte = parseFloat(localStorageValueCarte);
                        if (!isNaN(parsedValueCarte)) {
                            this.carteSoldeSubject.next(parsedValueCarte);
                        }
                    }
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
        // Check if the value is in localStorage
        const localStorageValue = localStorage.getItem('soldeWallet');
        if (localStorageValue) {
            const parsedValue = parseFloat(localStorageValue);
            if (!isNaN(parsedValue)) {
                this.walletSoldeSubject.next(parsedValue);
            }
        }
        return this.walletSoldeSubject.value;
    }

    getCarteSolde(): number {
        const localStorageValueCarte = localStorage.getItem('soldeCarte');
        if (localStorageValueCarte) {
            const parsedValueCarte = parseFloat(localStorageValueCarte);
            if (!isNaN(parsedValueCarte)) {
                this.carteSoldeSubject.next(parsedValueCarte);
            }
        }
        return this.carteSoldeSubject.value;
    }
}
