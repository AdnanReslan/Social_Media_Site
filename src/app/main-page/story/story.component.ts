import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Apollo, gql} from 'apollo-angular';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { PagesRequeat } from 'src/app/shared/PagesRequest.service';
import { Story } from 'src/app/shared/StoryType';
import { Token } from 'src/app/shared/token.service';

const addstory = gql`mutation addStory($image: Upload!) {
  addStory(image: $image){
    _id
    imageUrl
    createdAt
    author{
      _id
      name
      imageUrl  
    }
  }
}`

const storyseen = gql`mutation storySeen($storyId: ID!) {
  storySeen(id: $storyId)
}`

const mystories= gql` query myStories{
  myStories{
    story {
      _id
      imageUrl
      createdAt
    }
    viewers{
      _id
      name
      imageUrl
    }
    viewerCount
  }
}`

const getstories =  gql`query getStories {
  stories {
    _id
    name
    email
    stories {
      _id
      imageUrl
      createdAt 
    }
  }
}`

const story = gql`query story($storyId: ID!){
  story(storyId: $storyId){
    _id
    imageUrl
    createdAt
    author {
      _id
      name
      imageUrl 
    }
  }
}`

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css'],
  providers: [MessageService]
})
export class StoryComponent implements OnInit {
  file !: File | string;
  namefile!:string;
  @ViewChild('formstory') myInputVariable!: ElementRef; 
  Storyarr !: Story[];
  url!:string;
  urlim!:string;
  constructor(private apollo: Apollo , 
              private token: Token, 
              private messageService: MessageService, 
              private primengConfig: PrimeNGConfig,
              private pagesRequest : PagesRequeat) { }

  ngOnInit(): void {
    this.urlim=this.token.urlimg;
    this.primengConfig.ripple = true;
    this.ongetstory();
    this.ongetme();
   
    
  }
  ongetstory(){
    this.apollo.watchQuery<any>({
      query: getstories,
      errorPolicy: "all",
      context: {
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    }).valueChanges
      .subscribe((data) => {
       this.Storyarr=[];
       
   
     
        const StoryArray = data.data.stories;
         StoryArray.forEach((element: any)=>{
           this.Storyarr.push(new Story(element._id,element.name,element.stories[0]._id,element.stories[0].imageUrl,element.stories[0].createdAt))
         });
      
      }, err => {
        alert("Error fromstory")
        alert(err.message);
      })
     
     
  }



  onAddStory(){
    this.apollo.mutate<any>({
      mutation: addstory,
      variables: {
        image : this.file
      },
      errorPolicy: "all",
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token()? this.token.get_token():"")
      }
    })
    .subscribe((data) => {
      this.showSuccess()
    },(err)=>{
      alert(" add story error")
    })
    this.file="";
    this.namefile=""
  
  }

  onStorySeen(id : string){
    this.apollo.mutate<any>({
      mutation: storyseen,
      variables: {
        storyId : id
      },
      errorPolicy: "all",
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token()? this.token.get_token():"")
      }
    })
    .subscribe((data) => {
    
    },(err)=>{
      alert(err)
    })
  }



  onloadfile(event :any){
    this.file=<File>event.target.files[0]
     this.namefile=this.file.name;
     
    }

    showSuccess() {
      this.messageService.add({severity:'success', summary: 'Success', detail: 'The Story Posted'});
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
   
 ongetme(){
   this.pagesRequest.onGetMe().valueChanges.subscribe(data=>{
     this.url=data.data.getMe.imageUrl;
   })
 }
 


}
