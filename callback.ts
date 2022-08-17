export default class Callback {
    private static s_seq : number = 0;

    private m_id : number;
    private m_fun : Function;
    private m_thisArg : any;
    private m_inArgArray : any[];

    static Create(fun: Function, thisArg?: any, ...argArray: any[])
    {
        return new Callback(++Callback.s_seq, fun,thisArg,...argArray);
    }

    private constructor(id : number, fun: Function, thisArg: any, ...argArray: any[]) {
        this.m_id = id;
        this.m_fun = fun;
        this.m_thisArg = thisArg;
        this.m_inArgArray = argArray;
    }

    get ID() : number {
        return this.m_id;
    }

    Call(...argArray: any[]) : void {
        if (this.m_fun) {
            let arg : any[] = [];
            for (const param of this.m_inArgArray) {
                arg.push(param);
            }
            for (const param of argArray) {
                arg.push(param);
            }
            this.m_fun.call(this.m_thisArg,...arg);
        }
    }

    Compare(fun: Function, thisArg?: any):boolean{
        if(this.m_fun == fun && this.m_thisArg == thisArg){
            return true;
        }
        return false;
    }
    
}