import { environment } from "environments/environment";
import { HttpService } from "./http.service";
import { tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
    
export class RessourceService {

    constructor(private httpService: HttpService) { }
    
    getListType() {
        return this.httpService.get<any>(environment.listetype).pipe(
            tap(response => {
                if (response['code'] !== 200) {
                    console.error("Error fetching resource:", response);
                }
            })
        );
    }

}