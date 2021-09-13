import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import {Message, MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

const createUser = gql`mutation($email: String!, $name: String! , $password: String! , $age: Int , $image : Upload) {
  createUser(data: {email: $email , name: $name , password: $password , age: $age , image : $image}){
    _id
  }
}`


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [MessageService]
})
export class SignInComponent implements OnInit {
   s: boolean =false;
  signup !: FormGroup;
  errorForm  :string="";
  error : string="";
  errormessage : string="";
  userdata = { username: '', password: '', email: '', age: 18 }
  url :string="assets/img/logo.jpg";
  msgs1!: Message[];
  msgs2!: Message[];
  constructor( private apollo: Apollo ,private messageService: MessageService, private primengConfig: PrimeNGConfig ) { }

  ngOnInit() {
     this.signup=new FormGroup({
       'firstname' :new FormControl(null,Validators.required),
       'lastname' :new FormControl(null,Validators.required),
       'age' :new FormControl(null,[Validators.required,Validators.max(95),Validators.min(12),Validators.pattern(/^[1-9]+[0-9]*$/)]),
       'email' :new FormControl(null,[Validators.required,Validators.email]),
       'password' :new FormControl(null,[Validators.required,Validators.minLength(6)]),
     })
     this.primengConfig.ripple = true;
  }
 
  onSubmit() {
    this.userdata.username = this.signup.value.firstname + ' ' + this.signup.value.lastname;
    this.userdata.email = this.signup.value.email;
    this.userdata.password = this.signup.value.password;
    this.userdata.age = this.signup.value.age;
  }

  oncreataccount() {

    this.onSubmit();

     
 
    console.log(this.signup.controls.email.hasError('email'));
     
    this.apollo.mutate<any>({
      mutation: createUser,
      variables: {
        email: this.userdata.email,
        name: this.userdata.username,
        password: this.userdata.password,
        age: this.userdata.age
      },
      errorPolicy:"all",
    }).subscribe((data) => {

      
        if(data.errors){
          this.errorForm=data.errors[0].message;
          this.msgs2 = [
            {severity:'error', summary:'Error : ', detail:this.errorForm},
           ];
          this.signup.reset();
        }else{
          this.showSuccess()
           this.signup.reset();
        }
      },error=>{
        this.error=error;
        this.errormessage=error.message;
        this.msgs1 = [
          {severity:'error', summary:'Error : ', detail:this.errormessage},
         ];
      });
   
  }

  ss(){
  this.s=!this.s;
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Plz open your Email to affirmation'});
}

showInfo() {
    this.messageService.add({severity:'info', summary: 'Info', detail: 'Plz open your Email to affirmation '});
}

showWarn() {
    this.messageService.add({severity:'warn', summary: 'Warn', detail: 'Message Content'});
}

showError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});
}

showTopLeft() {
    this.messageService.add({key: 'tl', severity:'info', summary: 'Info', detail: 'Message Content'});
}

showTopCenter() {
    this.messageService.add({key: 'tc', severity:'info', summary: 'Info', detail: 'Message Content'});
}

showBottomCenter() {
    this.messageService.add({key: 'bc', severity:'info', summary: 'Info', detail: 'Message Content'});
}

showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
}

showMultiple() {
    this.messageService.addAll([
        {severity:'info', summary:'Message 1', detail:'Message Content'},
        {severity:'info', summary:'Message 2', detail:'Message Content'},
        {severity:'info', summary:'Message 3', detail:'Message Content'}
    ]);
}

showSticky() {
    this.messageService.add({severity:'info', summary: 'Sticky', detail: 'Message Content', sticky: true});
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

