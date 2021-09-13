export class Comment{
    
    public content   : string;
    public idcomment : string;
    public name      : string;
    public idauther  : string;
    public imageauther : string;
    public fileUrl   : string;
    constructor(content : string , idcomment : string , name : string , idauther : string ,imageauther : string, fileUrl : string){
        this.content = content;
        this.idcomment = idcomment;
        this.name = name;
        this.idauther = idauther;
        this.imageauther = imageauther;
        this.fileUrl  = fileUrl;
       
    }
}