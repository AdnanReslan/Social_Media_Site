import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Token } from '../shared/token.service';

const login = gql`query login($email: String! , $password: String!){
  login(data:{email: $email , password: $password}){
    token
    user{
      _id
    }
  }
}`

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [MessageService]
})
export class LogInComponent implements OnInit , OnDestroy{

  loggin !: FormGroup;
  errorForm  :string="";
  error : string="";
  errormessage : string="";
  @Output() onopenpagefromlogin=new EventEmitter<boolean>();
  userlogin = { email: '', password: '' };
  msgs1!: Message[];
  msgs2!: Message[];
  private querySubcription!: Subscription;

  constructor(private apollo: Apollo ,
              private route : Router,
              private token : Token,
              private messageService: MessageService, 
              private primengConfig: PrimeNGConfig,
              @Inject(DOCUMENT) private _document: Document)
               { }
 ngOnDestroy(){
 // this.querySubcription.unsubscribe();
  }

  ngOnInit() {
    this.loggin=new FormGroup({
    'email':new FormControl(null,[Validators.required,Validators.email]),
    'password':new FormControl(null,Validators.required)
    })

    this.primengConfig.ripple = true;
  }
 
  

  oncreataccount() {
  
  this.userlogin.email=this.loggin.value.email;
  this.userlogin.password=this.loggin.value.password;
  
  
  
     this.apollo.watchQuery<any>({
      query: login,
      variables: {
        email: this.userlogin.email,
        password: this.userlogin.password,
      },   
      errorPolicy:"all"
    }).valueChanges
      .subscribe((data ) => {
        if(data.errors){
        
          this.errorForm=data.errors[0].message;
          this.msgs2 = [
            {severity:'error', summary:'Error : ', detail:this.errorForm},
           ];
          this.loggin.reset();
        }
        else{
          
          localStorage.setItem('iduser',data.data.login.user._id);
          localStorage.setItem('token',data.data.login.token);
          sessionStorage.setItem('relode','true')
          sessionStorage.setItem('Islogin', 'true')
          this.route.navigate(['main-page']);
          this.token.Islogin.next(true);
          this._document.defaultView!.location.reload();
        }
      },error=>{
        console.log(error);
        
        this.error=error;
        this.errormessage=error.message;
        this.msgs1 = [
                      {severity:'error', summary:'error : ', detail:this.errormessage},
                     ];
      })
     
  }
  
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
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
  
}
