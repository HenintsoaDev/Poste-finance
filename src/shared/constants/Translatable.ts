import { IAction } from "../interfaces/IAction";
import { IMe } from "../interfaces/IMe";
import { IModule } from "../interfaces/IModule";
import { ISubModule } from "../interfaces/ISubModule";
import { itemStorage } from "./itemStorage";
import { storage } from "./storage";

declare var require: any;
declare var window: any;

export  class Translatable{
    static getLang() {
      throw new Error('Method not implemented.');
    }
    static data: Array<any> = [];
    public lang: string = '';
    static allowLang: string[] = ['en','fr',];

    constructor() {
        if(!this.lang){
            const currentLang = localStorage.getItem('lang');
            if(currentLang && Translatable.allowLang.includes(currentLang)){
                this.lang = currentLang;
            }else{
                this.lang = 'fr';
            }
        }
        Translatable.data = require(`../../assets/i18n/${this.lang}/lang.json`);
    }

    public __(key: string): string {
        const pathArray = key.split('.');
        let result = Translatable.data;

        for (const p of pathArray) {
            if (result && result.hasOwnProperty(p)) {
                result = result[p];
            } else {
                return key;
            }
        }
        return typeof result === 'string' ? result : key;
    }

    authority(actionCode: string) : boolean{
        return window['authorize'].find((item: string) => item == actionCode) ||  (storage.get(itemStorage.user_info) as IMe).info.admin == 1;
    }


    
}