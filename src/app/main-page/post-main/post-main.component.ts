import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  QueryRef } from 'apollo-angular';
import { Post } from 'src/app/shared/PostType.modules';
import { RequestReact } from 'src/app/shared/ReactionRequest.servicee';
import { Token } from 'src/app/shared/token.service';
import { Comment } from 'src/app/shared/comment.module';
import { CommentRequest } from 'src/app/shared/commentRequest.service';
import { PagesRequeat } from 'src/app/shared/PagesRequest.service';


@Component({
  selector: 'app-post-main',
  templateUrl: './post-main.component.html',
  styleUrls: ['./post-main.component.css']
})
export class PostMainComponent implements OnInit {
  id!:string;
  content!: string;
  comment!: FormGroup;
  publicpost:Post[] =[];
  displaycomment:boolean=false;
  creatcommentt = { content: '' }
  commentarr: Comment[] = [];
  isloading: boolean=false;
  refreshquery=false;
  postsQuery!: QueryRef<any>;
  myid!:string;
  fileComment!:any;
  editMode :boolean=false;
  idcomment!:string;
  customcomment !:string;
  urlim!:string;
constructor(private token: Token,
            private request : RequestReact,
            private commentRequest : CommentRequest,
            private modalService: NgbModal,
            private pagesRequest : PagesRequeat) { }

  ngOnInit(): void {
    this.urlim=this.token.urlimg;
    this.pagesRequest.onGetMe().valueChanges.subscribe((data)=>{
      this.myid=data.data.getMe._id;
    })
    this.comment = new FormGroup({
      'comments': new FormControl(null, Validators.required)
    })
    this.isloading=true;
    this.ongetmymainpost();
  }
 


  ongetmymainpost(){
    this.pagesRequest.onGetMypostsMain().valueChanges
    .subscribe((data ) => {
     this.publicpost=[];
      const postArray = data.data.getPostsOnFriends;
      postArray.forEach((element: any) => {
        this.publicpost.push(new Post( element.description,element._id,element.author.name,element.author.imageUrl,element.filesUrl,element.myReaction,element.likesCount,element.disLikeCount,element.lovesCount , element.author._id , element.author.name )); 
      });
       this.isloading=false;
    } , err=> {
      alert(err.message);
      this.publicpost[0].filesUrl===null;
    })
  }


  showcomment(){
    this.displaycomment = !this.displaycomment;
  }


  onlovepost(id : string){
    this.request.onLovePost(id).subscribe((data)=>{
    
      if(data.data.lovePost.myReaction=="LOVE"){
      for(let i=0;i<this.publicpost.length;i++){
        if(this.publicpost[i].id==id){
           this.publicpost[i].myReaction=="LOVE"
           break;
        }
      }
    }
    else{
      for(let i=0;i<this.publicpost.length;i++){
        if(this.publicpost[i].id==id){
           this.publicpost[i].myReaction=="NONE"
           break;
        }
      }
    }

    
    });
 
  }


  onlikepost(id : string){
    this.request.onLikePost(id).subscribe((data)=>{
  
      
      if(data.data.lovePost.myReaction=="LIKE"){
        for(let i=0;i<this.publicpost.length;i++){
          if(this.publicpost[i].id==id){
             this.publicpost[i].myReaction=="LIKE"
             break;
          }
        }
      }
      else{
        for(let i=0;i<this.publicpost.length;i++){
          if(this.publicpost[i].id==id){
             this.publicpost[i].myReaction=="NONE"
             break;
          }
        }
      }



    });
  }


  ondislikepost(id : string){
    this.request.onDisLikePost(id).subscribe((data)=>{
  
      if(data.data.lovePost.myReaction=="DISLIKE"){
        for(let i=0;i<this.publicpost.length;i++){
          if(this.publicpost[i].id==id){
             this.publicpost[i].myReaction=="DISLIKE"
             break;
          }
        }
      }
      else{
        for(let i=0;i<this.publicpost.length;i++){
          if(this.publicpost[i].id==id){
             this.publicpost[i].myReaction=="NONE"
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
          this.commentarr.push(new Comment(element.text, element._id, element.author.name, element.author._id,element.author.imageUrl , element.fileUrl ));
        });
      }, err => {
        alert("Error fromcomment")
        alert(err.message);
      })
  }

  refresh() {
    this.postsQuery.refetch();
  }

  sendcomment(id: string) {

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
  onloadfile(event : any) {
    this.fileComment=<File>event.target.files[0];
  
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

}
