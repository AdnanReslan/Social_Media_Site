export class Post{
    public contant:string;
    public id : string;
    public name : string;
    public imageauthor : string;
    public filesUrl : any[];
    public myReaction : string;
    public likesCount: number;
    public loveCount : number;
    public disLikesCount : number;
    public authorId : string;
    public authorName : string;
   
    constructor(contant:string , id :string , name:string , imageauthor : string, filesUrl :string [],myReaction : string , likesCount: number, disLikesCount : number , lovesCount : number , authorId : string, authorName : string )
    {
        this.contant=contant;
        this.id= id;
        this.name=name;
        this.imageauthor =imageauthor;
        this.filesUrl=filesUrl;
        this.myReaction=myReaction;
        this.likesCount= likesCount;
        this.loveCount=lovesCount;
        this.disLikesCount=disLikesCount;
        this.authorId = authorId;
        this.authorName =authorName;
       
    }
}