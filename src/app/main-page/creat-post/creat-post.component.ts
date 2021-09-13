import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl ,Validators , FormGroup} from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Token } from 'src/app/shared/token.service';

const createPost = gql`mutation createPost($description: String! , $files: [Upload]) {
  createPost(data: {description: $description , filesUrl: $files} ){
    _id
    description
    filesUrl
    author{
      name
      _id
      email
    }
  }
}`


@Component({
  selector: 'app-creat-post',
  templateUrl: './creat-post.component.html',
  styleUrls: ['./creat-post.component.css']
})
export class CreatPostComponent implements OnInit {
  post !: FormGroup; 
  file !:File;
  namefile!:string;
  uploadedFiles:any [] = [];
  creatpost={content:''}
constructor(private apollo: Apollo , private token: Token) { }
  ngOnInit(): void {
    this.post=new FormGroup({
      'post':new FormControl(null,[Validators.required,Validators.minLength(1)])
     
    })   
  }

  onpublish() {
   
   
    this.creatpost.content=this.post.controls.post.value;
    this.apollo.mutate<any>({
      mutation: createPost,
      variables: {
       description: this.creatpost.content,
       files: this.uploadedFiles
      },
      errorPolicy: "all",
  
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token()? this.token.get_token():"")
       
      }
    })
    .subscribe((data) => {
      if(data.errors){
        console.log(data.errors);
        
      }
      else{
        console.log(data);
        
      }
    },(err)=>{
      alert(err)
    })
   this.post.reset();
  }
 
  onloadfile(event : any) {
    for(let file of event.target.files) {
      this.uploadedFiles.push(file);
  }
  }


}
