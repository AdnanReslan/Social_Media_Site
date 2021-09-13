export class User{
    
    public name : string;
    public iduser : string;
    public imgurl : string;
    public isFriends : boolean
    public doHeSentMeFriendRequest: boolean;
    public doISentHimFriendRequest: boolean;
    
     constructor( name : string, iduser : string, imgurl : string , isFriends : boolean , doHeSentMeFriendRequest: boolean , doISentHimFriendRequest: boolean  ){
     this.name = name;
     this.iduser = iduser;
     this.imgurl = imgurl;
     this.isFriends = isFriends;
     this.doHeSentMeFriendRequest = doHeSentMeFriendRequest;
     this.doISentHimFriendRequest = doISentHimFriendRequest;
     }
 
 }   