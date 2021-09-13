import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagesRequeat } from '../shared/PagesRequest.service';
import { RequestReact } from '../shared/ReactionRequest.servicee';
import { Token } from '../shared/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  name!:string;
  url!: string;
  imageprofile !: File;
  Edituserform !: FormGroup;
  userdata = { username: '', age: 18 }
  urlim!:string;
  constructor(private request : RequestReact,
              private modalService: NgbModal,
              private token: Token,
              private pagesRequest : PagesRequeat) {}
 
  ngOnInit(): void {
    this.urlim=this.token.urlimg;
    this.getname();
    this.Edituserform=new FormGroup({
      'firstname' :new FormControl(null,Validators.required),
      'lastname' :new FormControl(null,Validators.required),
      'age' :new FormControl(null,[Validators.required,Validators.max(95),Validators.min(12),Validators.pattern(/^[1-9]+[0-9]*$/)])
    })
  }

  oninitializationinput() {
    this.userdata.username = this.Edituserform.value.firstname + ' ' + this.Edituserform.value.lastname;
    this.userdata.age = this.Edituserform.value.age;
  }

  onSubmit(){
    this.oninitializationinput();
    this.request.onUpdateUser(this.imageprofile ,this.userdata.username , this.userdata.age ).subscribe(data=>{
      this.Edituserform.reset();
    })
  }

  getname(){
    this.pagesRequest.onGetMe().valueChanges.subscribe((data)=>{
      this.name=data.data.getMe.name;
      this.url=data.data.getMe.imageUrl;
    })
  }

  openLg(content : any ) {
    this.modalService.open(content, { size: 'lg' });
  }


  onUpdateuser(name : string , age : number , file : File){
    this.request.onUpdateUser(file , name , age).subscribe(data=>{
  
    }, err => {
      alert("Error fromUpdateUser")
      alert(err.message);
    })
  }

  onloadfile(event : any) {
    this.imageprofile=<File>event.target.files[0];
  
  }
}


