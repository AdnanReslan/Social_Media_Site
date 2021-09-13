export class Glopal {
    private  islogin: boolean=false;
    set_openpage(open : boolean){
        this.islogin=open;
    }
    get_openpage(){
        return this.islogin;
    }
    
}