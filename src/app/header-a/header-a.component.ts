import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit,  ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Token } from '../shared/token.service';
import { User } from 'src/app/shared/UserType.module';
import { Notifications } from '../shared/NotificationsType.module';
import { MessageService , PrimeNGConfig } from 'primeng/api';
import { RequestReact } from '../shared/ReactionRequest.servicee';
import { FriendsRequest } from '../shared/FriendsRequest.service';
import { PagesRequeat } from '../shared/PagesRequest.service';

const LOG_OUT = gql`mutation {
  logout
}`



const resetpassword =gql`mutation resetPassword($oldPassword: String! , $newPassword: String!) {
  resetPassword(oldPassword: $oldPassword , newPassword: $newPassword)
}`

const Search=gql`query search($fieldSearch: String!) {
  textSearch(fieldSearch: $fieldSearch) {
    _id
    name
    imageUrl
    isFriends
    doHeSentMeFriendRequest
    doISentHimFriendRequest
  }
  
}`

const getnotifi= gql` query getNotification{
  notifications{
    _id
    from{
      _id
       name
      imageUrl
    }
    to {
      _id
      name
      imageUrl
    }
    label
    createdAt
    
  }
}`

const notificsub = gql ` subscription notification {
  newNotification{
     _id
    from{
      _id
       name
      imageUrl
    }
    to {
      _id
      name
      imageUrl
    }
    label
    createdAt
  }
}`



@Component({
  selector: 'app-header-a',
  templateUrl: './header-a.component.html',
  styleUrls: ['./header-a.component.css'],
  providers: [MessageService]
})
export class HeaderAComponent implements OnInit ,OnDestroy {
 
  constructor( private apollo: Apollo,   
               private token : Token, 
               private route : Router,
               private modalService: NgbModal,
               private messageService: MessageService, 
               private primengConfig: PrimeNGConfig,
               private request : RequestReact,
               private friendsRequest : FriendsRequest,
               private pagesRequest : PagesRequeat
               ) {this.queryRef = this.apollo.watchQuery({
                query: getnotifi
              }); }
 
  
  @ViewChild('f') resetpasswordform !: NgForm;
  Islogin : boolean=false;
  private Activesub !: Subscription;
  Search !: FormGroup;
  UserSearchArr : User [] = [];
  NotifictionsArr : Notifications[] = [];
  queryRef: QueryRef<any>;
  Userreqme: User[]=[];
  UserIreq: User[]=[];
  url !: string;
  refresfriendrequsthquery=false;
  reqfrienQuery!: QueryRef<any>;
  urlim!:string;
  ngOnInit(): void {
    this.urlim=this.token.urlimg
    this.primengConfig.ripple = true;
 this.Activesub= this.token.Islogin.subscribe(Active=>{
     this.Islogin=Active;
      if(this.Islogin){
        this.ongetnotifi();
        this.subscription();
        this.ongetfriendrequstformsomeone();
        this.ongetfriendrequstformme();
        this.ongetimageurl();
      }
   })
   this.Search=new FormGroup({
    'search':new FormControl(null,[Validators.required])
    })
  }

  onlogout(){  
    this.apollo.mutate<any>({
     mutation: LOG_OUT,
     context: {
       headers: new HttpHeaders().set("Authorization", this.token.get_token()! )
     },
     errorPolicy:"all",
   }).subscribe((data) => {
       if(data.errors){
        this.route.navigate(['/login']);
        this.token.Islogin.next(false);
        this.token.del_token();
        localStorage.removeItem('iduser');
         alert(data.errors[0].message);
         alert("Error from re of log out")
       }
       else{
        this.route.navigate(['/login']);
        this.token.Islogin.next(false);
         this.token.del_token();
         localStorage.removeItem('iduser');
         window.location.reload();
       }
     },error=>{
       alert(error.message);
       this.token.del_token();
       localStorage.removeItem('iduser');
     });
}


onresetpassword(){
 this.apollo.mutate<any>({
  mutation: resetpassword,
  variables: {
    oldPassword: this.resetpasswordform.form.controls.oldpassword.value,
    newPassword: this.resetpasswordform.form.controls.newpassword.value,
  },
  errorPolicy: "all",
  context: {
    headers: new HttpHeaders().set("Authorization", this.token.get_token()? this.token.get_token():"")
  }
})
.subscribe((data) => {
  if(data.errors){
   alert(data.errors[0].message);
    this.resetpasswordform.reset();
  }else{
     this.resetpasswordform.reset();
  }
},error=>{
 alert(error);
});
}

onSearch(){ 
  this.UserSearchArr=[];
  this.apollo.watchQuery<any>({
    query: Search,
    variables: {
      fieldSearch:this.Search.value.search
    },
    errorPolicy: "all",
    context: {
      headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
    }
  }).valueChanges.subscribe((data)=>{
   
    const usersearcharr = data.data.textSearch
    usersearcharr.forEach((element :any )=> {
    this.UserSearchArr.push(new User(element.name , element._id , element.imageUrl , element. isFriends,element.doHeSentMeFriendRequest,element. doISentHimFriendRequest))
    });
    this.Search.reset(); 
  },error=>{
 alert(error);
})
}

openSm(content : any) {
  this.modalService.open(content, { size: 'sm' });
}

ongetnotifi(){
  this.apollo.watchQuery<any>({
    query: getnotifi,
    errorPolicy: "all",
    context: {
      headers: new HttpHeaders().set("Authorization", this.token.get_token() !)
    }
  }).valueChanges.subscribe((data)=>{
    const notifiarr = data.data.notifications;
    notifiarr.forEach((element : any) => {
      this.NotifictionsArr.push(new Notifications(element._id,element.createdAt,element.label,element.from._id,element.from.imageUrl,element.from.name))
    });
  }, err => {
    alert("Error fromcomment")
    alert(err.message);
  })
}
     subscription() {
      this.queryRef.subscribeToMore<any>({
      document: notificsub,
      updateQuery: (prev, { subscriptionData }) => {
      this.showInfo(subscriptionData.data.newNotification.label );
      this.NotifictionsArr.push(new Notifications(subscriptionData.data.newNotification._id,subscriptionData.data.newNotification.createdAt,subscriptionData.data.newNotification.label,subscriptionData.data.newNotification.from._id,subscriptionData.data.newNotification.from.imageUrl,subscriptionData.data.newNotification.from.name))
      }
    })
  }

  showInfo(lable : string ) {
    this.messageService.add({severity:'info', summary: 'Info', detail: lable});
}


onConfirm() {
  this.messageService.clear('c');
}

onReject() {
  this.messageService.clear('c');
}

clear() {
  this.messageService.clear();
}


ngOnDestroy(): void {
 this.Activesub.unsubscribe();
 this.token.del_token();
}

ongetfriendrequstformsomeone(){
  this.Userreqme=[];
    if(this.refresfriendrequsthquery){
      this.refetchuser();
  } 
  this.reqfrienQuery=this.pagesRequest.onGetMe()
  this.reqfrienQuery.valueChanges.subscribe(data=>{
    this.Userreqme=[];
   const friendRequestsReceived = data.data.getMe.friendRequestsReceived;
   friendRequestsReceived.forEach((element : any) => { 
     this.Userreqme.push(new User(element.name,element._id,element.imageUrl,element.isFriends,element.doHeSentMeFriendRequest,element.doISentHimFriendRequest))
   });
  })
}

ongetfriendrequstformme(){
  this.UserIreq=[];
  this.pagesRequest.onGetMe().valueChanges.subscribe(data=>{
    
    this.UserIreq=[];
   const friendRequestsSent = data.data.getMe.friendRequestsSent;
   friendRequestsSent.forEach((element : any) => { 
   this.UserIreq.push(new User(element.name,element._id,element.imageUrl,element.isFriends,element.doHeSentMeFriendRequest,element.doISentHimFriendRequest))
   });
  })
}

onacceptfriendrequst(id : string){
  this.friendsRequest.onAcceptFriendRequest(id).subscribe(data=>{
 
    this.refetchuser();
  }, err => {
    alert("Error fromcomment")
    alert(err.message);
  })
}


ondeletereqformsomeone(id : string){
  this.friendsRequest.onRejectFriendRequest(id).subscribe(data=>{
   
    this.refetchuser();
  })
}

ondeleterequstfriend(id : string){
  this.friendsRequest.onDeleteFriendRequestSent(id).subscribe(data=>{
    
    
  }, err => {
    alert("Error fromcomment")
    alert(err.message);
  })
}

ongetimageurl(){
  this.pagesRequest.onGetMe().valueChanges.subscribe(data=>{
    this.url=data.data.getMe.imageUrl;
  })
}


refetchuser(){
  this.reqfrienQuery.refetch();
}

}




