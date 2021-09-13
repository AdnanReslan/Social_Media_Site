export class Notifications{
    
    public idnoti :string;
    public createdat : Date;
    public lable : string;
    public idfrom : string
    public imageurl : string;
    public name : string;

    constructor(  idnoti :string, 
                 createdat : Date ,
                 lable : string , 
                 idfrom : string ,
                 imageurl : string, 
                 name : string,
                ){
      this.idnoti=idnoti;
      this.createdat=createdat;
      this.lable=lable;
      this.idfrom=idfrom;
      this.imageurl=imageurl;
      this.name = name;
     
    }

}