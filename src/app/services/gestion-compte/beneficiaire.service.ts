import { environment } from "environments/environment";

import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";

@Injectable({
    providedIn: 'root',
})
    
export class BeneficiaireService {

    constructor(private httpService: HttpService) { }
    
    updateBeneficiaire(credentials): Observable<any> {
        return this.httpService.put<any>(environment.beneficiaire + '/' + credentials.rowid, credentials).pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

}