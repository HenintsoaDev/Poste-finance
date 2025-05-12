import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "app/services/http.service";
import { environment } from "environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class HistoriqueVirementsService {

    constructor(private http: HttpClient, private httpService: HttpService,private  router: Router) {}

    validerVirement(id): Observable<any>
    {
        return this.httpService.put<any>(environment.valide_virement+'/'+id,'').pipe(
            tap(response => {
                if (response['code'] === 200) {
                    console.log("response XHR", response)
                }
            })
        );
    }

}

