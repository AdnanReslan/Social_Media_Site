import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryRef } from 'apollo-angular';
import { Post } from '../shared/PostType.modules';
import { RequestReact } from '../shared/ReactionRequest.servicee';
import { User } from '../shared/UserType.module';
import { Comment } from 'src/app/shared/comment.module';
import { Token } from '../shared/token.service';
import { FriendsRequest } from '../shared/FriendsRequest.service';
import { PagesRequeat } from '../shared/PagesRequest.service';
import { CommentRequest } from '../shared/commentRequest.service';
@Component({
  selector: 'app-otherprofile',
  templateUrl: './otherprofile.component.html',
  styleUrls: ['./otherprofile.component.css']
})
export class OtherprofileComponent implements OnInit {
  
  UserData : User;
  PostArr  : Post[] = []; 
  CommentArr : Comment[] = [];
  FriendArr : User[] = [];
  MutualFriends : User[] = [];
  fileComment !:any;
  comment!: FormGroup;
  postsQuery!: QueryRef<any>;
  refreshquery=false;
  myid!:string;
  FriendsCount !: number;
  MutualFriendsCount !: number;
  curid!:string;
  isMe=false;
  refresfriendrequsthquery=false;
 reqfrienQuery!: QueryRef<any>;
 urlim!:string;
  constructor(private request : RequestReact , 
              private route : ActivatedRoute,
              private modalService: NgbModal,
              private router : Router,
              private token: Token,
              private commentRequest : CommentRequest,
              private friendsRequest : FriendsRequest,
              private pagesRequest : PagesRequeat) {
                this.UserData=new User("name","id","assets",false,false,false)
               }
   userid!: string;
  ngOnInit(): void {
    this.urlim=this.token.urlimg
    this.comment = new FormGroup({
      'comments': new FormControl(null, Validators.required)
    })
    this.ongetmyid();
   this.route.paramMap.subscribe(params=>{
     if(params.get('id')?.toString()==this.myid){
      this.router.navigate(['myprofile']);
     
     }
     else{
    
      this.userid!=params.get('id')?.toString();
      this.ongetuser(params.get('id')!.toString());
      this.ongetposts(params.get('id')!.toString());
      this.ongetfriend(params.get('id')!.toString());
      this.ongetmutualfriends(params.get('id')!.toString());
     }
  
    
   })
   
   if(this.myid===this.curid){
     this.isMe=true;
   }
  }


  ongetuser(id : string){
    this.UserData != null;
    if(this.refresfriendrequsthquery){
      this.refetchuser();
  } 
    this.reqfrienQuery=this.pagesRequest.onGetProfile(id)
    this.reqfrienQuery.valueChanges.subscribe((data)=>{
   
      this.UserData != null;
      this.refresfriendrequsthquery=true;
       this.curid=data.data.getProfile._id;
       
        this.UserData=new User(data.data.getProfile.name , data.data.getProfile._id,data.data.getProfile.imageUrl,data.data.getProfile.isFriends ,data.data.getProfile.doHeSentMeFriendRequest , data.data.getProfile.doISentHimFriendRequest)
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }


  ongetposts(id : string){
    this.pagesRequest.onGetProfile(id).valueChanges.subscribe((data)=>{
   
      this.PostArr=[]
      const postArray = data.data.getProfile.posts;
      postArray.forEach(
        (element:any) => {
       this.PostArr.push(
         new Post
        
         (element.description, element._id, element.author.name, element.author.imageUrl, element.filesUrl,element.myReaction, element.likesCount,element. disLikeCount,element. lovesCount , element.author._id , element.author.name ));
        
      });
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }

  onlovepost(id : string){
    this.request.onLovePost(id).subscribe((data)=>{
 
      if(data.data.lovePost.myReaction=="LOVE"){
      for(let i=0;i<this.PostArr.length;i++){
        if(this.PostArr[i].id==id){
           this.PostArr[i].myReaction=="LOVE"
           break;
        }
      }
    }
    else{
      for(let i=0;i<this.PostArr.length;i++){
        if(this.PostArr[i].id==id){
           this.PostArr[i].myReaction=="NONE"
           break;
        }
      }
    }

    
    });
 
  }


  onlikepost(id : string){
    this.request.onLikePost(id).subscribe((data)=>{
 
      if(data.data.lovePost.myReaction=="LIKE"){
        for(let i=0;i<this.PostArr.length;i++){
          if(this.PostArr[i].id==id){
             this.PostArr[i].myReaction=="LIKE"
             break;
          }
        }
      }
      else{
        for(let i=0;i<this.PostArr.length;i++){
          if(this.PostArr[i].id==id){
             this.PostArr[i].myReaction=="NONE"
             break;
          }
        }
      }



    });
  }


  ondislikepost(id : string){
    this.request.onDisLikePost(id).subscribe((data)=>{

      if(data.data.lovePost.myReaction=="DISLIKE"){
        for(let i=0;i<this.PostArr.length;i++){
          if(this.PostArr[i].id==id){
             this.PostArr[i].myReaction=="DISLIKE"
             break;
          }
        }
      }
      else{
        for(let i=0;i<this.PostArr.length;i++){
          if(this.PostArr[i].id==id){
             this.PostArr[i].myReaction=="NONE"
             break;
          }
        }
      }
    });
  }

  sendcomment(id: string) {
    
    this.commentRequest.onAddComment(id, this.comment.controls.comments.value, this.fileComment)
      .subscribe((data) => {
       this.refresh();
        this.comment.reset();
      }, err => {
        alert(err.message);
      })
  }

  openLg(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }


  onloadfile(event : any) {
    this.fileComment=<File>event.target.files[0];
  
  }

  getcommentforpost(id: string) {
    this.CommentArr = [];
    if(this.refreshquery){
      this.refresh();
  } 
    this.postsQuery = this.commentRequest.onGetComment(id)
      this.postsQuery
      .valueChanges
      .subscribe((data) => {
        this.CommentArr=[]
        this.refreshquery=true;
        const commentArray = data.data.getCommentForPost;
      
        
        commentArray.forEach((element: any) => {
         this.CommentArr.push(new Comment(element.text, element._id, element.author.name, element.author._id,element.author.imageUrl , element.fileUrl ));
        });
      }, err => {
        alert("Error fromcomment")
        alert(err.message);
      })
  }


  refresh() {
    this.postsQuery.refetch();
  }
  refetchuser(){
    this.reqfrienQuery.refetch();
  }

  onDeletecomment(id: string) {
    this.commentRequest.onDeleteComment(id)
      .subscribe((data) => {
        this.CommentArr.forEach((mem) => {
          if (id === mem.idcomment) {
            this.CommentArr.splice(this.CommentArr.indexOf(mem),1);
          }
        })
      }), (error: { message: any; }) => {
        alert(error.message);
      }
  }

  ongetfriend(id : string){
    this.FriendArr=[];
    this.pagesRequest.onGetProfile(id).valueChanges.subscribe((data)=>{
      this.FriendArr=[];
        this.FriendsCount=data.data.getProfile.friends.friendsCount;
        const friendarr = data.data.getProfile.friends.friendsData;
        friendarr.forEach((element:any) => {
        this.FriendArr.push(new User( element.name,element._id ,element.imageUrl,element.isFriends , element.doHeSentMeFriendRequest , element.doISentHimFriendRequest));
        });
   }, err => {
     alert("Error fromcomment")
     alert(err.message);
   })
  }

  
  ongetmutualfriends(id : string){
    this.pagesRequest.onGetProfile(id).valueChanges.subscribe((data)=>{
      this.MutualFriendsCount=data.data.getProfile.mutualFriends.mutualFriendsCount
        const mufriendarr = data.data.getProfile.mutualFriends.mutualFriendsData;
        mufriendarr.forEach((element:any) => {
        this.MutualFriends.push(new User(element._id ,element.name ,element.imageUrl,element.isFriends , element.doHeSentMeFriendRequest , element.doISentHimFriendRequest));
        });
   }, err => {
     alert("Error fromcomment")
     alert(err.message);
   })
  }

  onsendfriendrequst(id : string){
    this.friendsRequest.onSendFriendRequest(id).subscribe(data=>{
     
      this.refetchuser()
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }

  ondeletefriend(id : string){
    this.friendsRequest.onDeleteFriend(id).subscribe(data=>{
  
       this.refetchuser()
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }

  ondeleterequstfriend(id : string){
    this.friendsRequest.onDeleteFriendRequestSent(id).subscribe(data=>{

      this.refetchuser()
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }

  onacceptfriendrequst(id : string){
    this.friendsRequest.onAcceptFriendRequest(id).subscribe(data=>{
     
      this.refetchuser()
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }

  ondeletereqformsomeone(id : string){
    this.friendsRequest.onRejectFriendRequest(id).subscribe(data=>{

      this.refetchuser()
    })
  }

  openSm(content :any) {
    this.modalService.open(content, { size: 'sm' });
  }

  ongetmyid(){
    this.pagesRequest.onGetMe().valueChanges.subscribe(data=>{
      this.myid=data.data.getMe._id;
     
    })
  }
  
}
