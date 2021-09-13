export class Story{
    
   public iduser : string;
   public name   : string;
   public idstory : string;
   public imgeurl : string;
   public createdAt : Date;

    constructor(iduser : string , name : string , idstory : string , imgeurl : string,createdAt : Date){
      this.iduser = iduser;
      this.name= name;
      this.idstory = idstory;
      this.imgeurl =imgeurl;
      this.createdAt=createdAt;
    }

}   