import { Auth } from "app/shared/models/db";
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

    autority(codeAction) : boolean{
        let  user = <Auth> window['authority']['user'];
        if(user.info.admin === 1){
            return true ;
        }
        //return !!this.actionModule().find((item)=> item.code === codeAction && item.state ===1);
    }

    /*public actionModule(): profilage_droit[]{
        if(window['actions']){
            return window['actions'] ;
        }
        let codeSousModule:Array<string> = window['authority']['sous_module'] || [] ;
        let codeModule:Array<string> = window['authority']['module'];
        // console.log('WWW',codeModule)
        let  user =<Auth>  window['authority']['user'];
        try {
            let module: profilage_module[] = user.modules.filter((item:profilage_module)=>  codeModule.indexOf(item.code)!==-1);
        // console.log('mod',module);
            let sousModule:profilage_sous_module []=[];
            if(module){
            {
                for (let i=0 ;i< module.length ;i++){
                let sous_module_ = module[i].sous_modules.filter((item)=>  codeSousModule.indexOf(item.code) !== -1);
                //console.log('OK SOUS MODULE',sous_module_)
                if(sous_module_){
                    sousModule.push(...sous_module_);
                }
                }
            }
            let actions:profilage_droit[]=[];
            for (let i= 0;i< sousModule.length;i++){
                actions.push(...sousModule[i].actions)
            }
            //console.log("ASC",actions,sousModule,codeSousModule)
            return   window['actions'] = actions;
            }
            return [];
        } catch (e) {
            return  [] ;
        }
    }*/


    
}