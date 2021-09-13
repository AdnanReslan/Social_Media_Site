import { Subject } from "rxjs";

export class Token{
   token !:string;
   Islogin = new Subject<boolean>();
   urlimg ="http://localhost:4000/post/photo/"
  get_token() : string{
    return localStorage.getItem('token')!.toString() ;
  }

  del_token(){
    localStorage.removeItem('token');
    this.token="";
}
}