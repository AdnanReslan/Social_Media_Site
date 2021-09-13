import { HttpHeaders } from '@angular/common/http';
import { Component,  OnInit,  } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Token } from 'src/app/shared/token.service';
import { Post } from 'src/app/shared/PostType.modules';
import { Comment } from 'src/app/shared/comment.module';
import { RequestReact } from 'src/app/shared/ReactionRequest.servicee';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/shared/UserType.module';
import { CommentRequest } from 'src/app/shared/commentRequest.service';
import { FriendsRequest } from 'src/app/shared/FriendsRequest.service';
import { PagesRequeat } from 'src/app/shared/PagesRequest.service';


const deletePost = gql` mutation deletePost($id: ID!) {
  deletePost(id: $id){
    _id
    description
    createdAt
  }
}`

const updatePost = gql`mutation updatePost($id: ID! , $description: String! , $files: [Upload]) {
  updatePost(id: $id,data: { description: $description , filesUrl: $files}){
    _id
    description
    filesUrl
  }
}`






const friendPraivacy = gql `mutation changePrivacy($friendsPrivacy: FriendsPrivacyInput!) {
  changeFriendsPrivacy(friendsPrivacy: $friendsPrivacy)
}`

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  prvatepost: Post[] = [];
  private editpostquery!: QueryRef<any>;
  postsQuery!: QueryRef<any>;
  name !: string;
  myid!:string;
  isloading: boolean = false;
  displaycomment: boolean = false;
  comment!: FormGroup;
  creatcommentt = { content: '' }
  id !: string;
  editpostform !: FormGroup;
  oldpost!: string;
  queryRef!: QueryRef<any>;
  commentarr: Comment[] = [];
  refreshquery=false;
  refreshqueryedit=false;
  uploadedFiles:any [] = [];
  fileComment !: File;
  customcomment !:string;
  editMode :boolean=false;
  idcomment!:string;
  friendsArr :User[]=[];
  friendscount !: Number;
  urlim!:string;
  constructor(private token: Token, 
              private apollo: Apollo, 
              private request : RequestReact,
              private modalService: NgbModal,
              private primengConfig: PrimeNGConfig,
              private commentRequest : CommentRequest,
              private friendsRequest : FriendsRequest,
              private pagesRequest : PagesRequeat
              ) {}

  ngOnInit(): void {
    this.urlim=this.token.urlimg;
    this.primengConfig.ripple = true;
    this.comment = new FormGroup({
      'comments': new FormControl(null, Validators.required)
    })
    this.editpostform= new FormGroup({
      'editPost': new FormControl(null,Validators.required)
    })
    this.isloading = true;
    this.ongetpost();
    this.ongetfriends();
 
  
  }
 

  ongetpost(){
    this.prvatepost = [];
    if(this.refreshqueryedit){
      this.refreshpost();
  } 
    this.editpostquery = this.pagesRequest.onGetMe()
    this.editpostquery.valueChanges
      .subscribe((data) => {
    
        
       this.prvatepost=[];
       this.refreshqueryedit=true;
        this.name = data.data.getMe.name;
        this.myid= data.data.getMe._id;
        const postArray = data.data.getMe.posts;
        postArray.forEach(
          (element: any) => {
         this.prvatepost.push(
           new Post
           (element.description, element._id, this.name,element.author.imageUrl, element.filesUrl,element.myReaction, element.likesCount,element. disLikeCount,element. lovesCount , element.author._id , element.author.name ));
          
        });
       
        this.isloading = false;
      }, err => {
        alert("Error fromprofile")
        alert(err.message);
      })
  }

  onDeletePost(id: string) {
    this.apollo.mutate<any>({
      mutation: deletePost,
      variables: {
        id: id
      },
      errorPolicy: "all",

      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token() ? this.token.get_token() : "")

      }
    })
      .subscribe((data) => {

        this.refreshpost();
      }), (error: { message: any; }) => {
        alert(error.message);
      }

  }
  

  
  oneditpost(id: string) {
    
  
    
    this.apollo.mutate<any>({
      mutation: updatePost,
      variables: {
        id: id,
        description: this.editpostform.controls.editPost.value,
        files: this.uploadedFiles
      },
      errorPolicy: "all",
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token() !)
      }
    })
      .subscribe((data) => {
        this.refreshpost();
      
      })
  }


  sendcomment(id: string ) {
    if(!this.editMode){
      this.creatcommentt.content = this.comment.controls.comments.value;
      this.commentRequest.onAddComment(id, this.creatcommentt.content , this.fileComment)
        .subscribe((data) => {
     
          
         this.refresh();
          this.comment.reset();
        }, err => {
          alert(err.message);
        })
    }
    else{
      this.onEditComment(this.idcomment);
    }
    
  }



  sendid(idd: string) {
    this.id = idd;
  }

 



  loadpost(oldpost: string) {
    this.oldpost = oldpost;

  }



  getcommentforpost(id: string) {
    this.commentarr = [];
    if(this.refreshquery){
      this.refresh();
  } 
    this.postsQuery = this.commentRequest.onGetComment(id)
      this.postsQuery
      .valueChanges
      .subscribe((data) => {

        this.commentarr=[]
        this.refreshquery=true;
        const commentArray = data.data.getCommentForPost;
        commentArray.forEach((element: any) => {
          this.commentarr.push(new Comment(element.text, element._id, element.author.name, element.author._id ,element.author.imageUrl, element.fileUrl ));
        });
      }, err => {
        alert("Error fromcomment")
        alert(err.message);
      })
  }

  //     subscription(id: string) {
  //     this.queryRef.subscribeToMore<any>({
  //     document: commentsubscribe,
  //     variables: {
  //       postID: id
  //     },
  //     updateQuery: (prev, { subscriptionData }) => {
  //     console.log(subscriptionData)
  //       if (subscriptionData.data.comment.mutation == "Create") {
  //         this.commentarr.push(new Comment(subscriptionData.data.comment.data.text, subscriptionData.data.comment.data._id, subscriptionData.data.comment.data.author.name, subscriptionData.data.comment.data.author._id  ));
  //       }
  //       else if (subscriptionData.data.comment.mutation == "Delete") {
  //         this.commentarr.forEach((mem) => {
  //           if (mem.idcomment == subscriptionData.data.comment.data._id) {
  //             this.commentarr.splice(this.commentarr.indexOf(mem),1);
  //           }
  //         })

  //       }
  //     }
  //   })
  // }
  // subscription(id: string){
  //  this.querySubcription1= this.apollo.subscribe<any>({
  //     query:commentsubscribe,
  //     variables:{
  //       postID: id
  //     },
  //   }).subscribe(subscriptionData=>{
  //     console.log(subscriptionData);
  //     if (subscriptionData.data.comment.mutation == "Create") {
  //               this.commentarr.push(new Comment(subscriptionData.data.comment.data.text, subscriptionData.data.comment.data._id, subscriptionData.data.comment.data.author.name, subscriptionData.data.comment.data.author._id ,true ));
  //             }
  //             else if (subscriptionData.data.comment.mutation == "Delete") {
  //               this.commentarr.forEach((mem) => {
  //                 if (mem.idcomment == subscriptionData.data.comment.data._id) {
  //                   this.commentarr.splice(this.commentarr.indexOf(mem));
  //                 }
  //               })
      
  //             }
  //   })
  // }


  onDeletecomment(id: string) {
    this.commentRequest.onDeleteComment(id)
      .subscribe((data) => {
        this.commentarr.forEach((mem) => {
          if (id === mem.idcomment) {
            this.commentarr.splice(this.commentarr.indexOf(mem),1);
          }
        })
      }), (error: { message: any; }) => {
        alert(error.message);
      }
  }


  refresh() {
    this.postsQuery.refetch();
  }

  refreshpost(){
    this.editpostquery.refetch();
  }



  onlovepost(id : string){
    this.request.onLovePost(id).subscribe((data)=>{
 
      if(data.data.lovePost.myReaction=="LOVE"){
      for(let i=0;i<this.prvatepost.length;i++){
        if(this.prvatepost[i].id==id){
           this.prvatepost[i].myReaction=="LOVE"
           break;
        }
      }
    }
    else{
      for(let i=0;i<this.prvatepost.length;i++){
        if(this.prvatepost[i].id==id){
           this.prvatepost[i].myReaction=="NONE"
           break;
        }
      }
    }

    
    });
 
  }


  onlikepost(id : string){
    this.request.onLikePost(id).subscribe((data)=>{

      
      if(data.data.lovePost.myReaction=="LIKE"){
        for(let i=0;i<this.prvatepost.length;i++){
          if(this.prvatepost[i].id==id){
             this.prvatepost[i].myReaction=="LIKE"
             break;
          }
        }
      }
      else{
        for(let i=0;i<this.prvatepost.length;i++){
          if(this.prvatepost[i].id==id){
             this.prvatepost[i].myReaction=="NONE"
             break;
          }
        }
      }



    });
  }


  ondislikepost(id : string){
    this.request.onDisLikePost(id).subscribe((data)=>{
  
      if(data.data.lovePost.myReaction=="DISLIKE"){
        for(let i=0;i<this.prvatepost.length;i++){
          if(this.prvatepost[i].id==id){
             this.prvatepost[i].myReaction=="DISLIKE"
             break;
          }
        }
      }
      else{
        for(let i=0;i<this.prvatepost.length;i++){
          if(this.prvatepost[i].id==id){
             this.prvatepost[i].myReaction=="NONE"
             break;
          }
        }
      }
    });
  }

  
  ngOnDestroy() {
    
  
  }

  closeResult!: string;

  
  

  openLg(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  
 
  openLgedit(contentt: any) {
    this.modalService.open(contentt, { size: 'lg' });
  }

  onloadfiles(event : any) {
    for(let file of event.target.files) {
      this.uploadedFiles.push(file);
  }
  }

  onEditComment(id : string){

  this.commentRequest.onUpdateComment( this.idcomment,this.comment.controls.comments.value,this.fileComment).subscribe(data=>{
 
    this.comment.reset();
    this.editMode=false;
  }, err => {
    alert("Error fromcomment")
    alert(err.message);
  })
  }

  onloadcooment(id : string ){
    this.editMode=true;
    this.idcomment=id;
    this.commentarr.forEach(element=>{
      if(element.idcomment==id){
     
        this.customcomment=element.content;
      
      }
    })
  }
  
  onloadfile(event : any) {
    this.fileComment=<File>event.target.files[0];
  
  }

  ongetfriends(){
    this.friendsArr=[]
    this.pagesRequest.onGetMe().valueChanges.subscribe(data=>{
      this.friendscount=data.data.getMe.friends.friendsCount;
      const friendsarr = data.data.getMe.friends.friendsData;
  
      this.friendsArr=[]
      friendsarr.forEach((element : any) => {
        this.friendsArr.push(new User( element.name, element._id,element.imageUrl,true , false ,false))
      });
   
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }

  openSm(content :any) {
    this.modalService.open(content, { size: 'sm' });
  }

  ondeletefriend(id : string){
    this.friendsRequest.onDeleteFriend(id).subscribe(data=>{
      
    }, err => {
      alert("Error fromcomment")
      alert(err.message);
    })
  }


onFriendPrivacy(choice : string){
  this.apollo.mutate<any>({
    mutation: friendPraivacy,
    variables: {
      friendsPrivacy : choice
    },
    errorPolicy: "all",
    context: {
      useMultipart: true,
      headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
    }
  })
  .subscribe((data) => {
   
  },(err)=>{
    alert(" add story error")
  })
}
  

}


