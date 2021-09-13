import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Token } from "./token.service";



const LikePost = gql`mutation likePost($postId: ID!) {
    likePost(postId: $postId){
      _id
      description
      filesUrl
      likes {
        _id
        name
        email
      }
      loves {
        _id
        name
        email
      }
      disLikes {
        _id
        name
        email
      }
      likesCount
      disLikeCount
      lovesCount
      myReaction
    }
  }`

const DisLikePost = gql`mutation disLikePost($postId: ID!) {
    disLikePost(postId: $postId){
      _id
      description
      filesUrl
      likes {
        _id
        name
        email
      }
      loves {
        _id
        name
        email
      }
      disLikes {
        _id
        name
        email
      }
      likesCount
      disLikeCount
      lovesCount
      myReaction
    }
  }`

const LovePost = gql`mutation lovePost($postId: ID!) {
    lovePost(postId: $postId){
      _id
      description
      filesUrl
      likes {
        _id
        name
        email
      }
      loves {
        _id
        name
        email
      }
      disLikes {
        _id
        name
        email
      }
      likesCount
      disLikeCount
      lovesCount
      myReaction
    }
  }`





  const UpDateUser = gql `mutation updateUser($file:Upload , $name: String , $age: Int){
    updateUser(data:{name:$name , age:$age , image:$file}){
      _id
      name
      email
      imageUrl
    }
  }`


@Injectable({ providedIn: 'root' })

export class RequestReact {

  constructor(private apollo: Apollo, private token: Token) {
  }



  onLikePost(id: string) {
    return (this.apollo.mutate<any>({
      mutation: LikePost,
      variables: {
        postId: id,
      },
      errorPolicy: "all",
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    })
    )
  }




  onDisLikePost(id: string) {
    return (this.apollo.mutate<any>({
      mutation: DisLikePost,
      variables: {
        postId: id,
      },
      errorPolicy: "all",
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    })
    )
  }



  onLovePost(id: string) {
    return (this.apollo.mutate<any>({
      mutation: LovePost,
      variables: {
        postId: id,
      },
      errorPolicy: "all",
      context: {
        useMultipart: true,
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    })
    )
  }
  
  onUpdateUser(file: File , name : string , age : number ) {
    if(name=="null null"){
      return (this.apollo.mutate<any>({
        mutation: UpDateUser,
        variables: {
          file: file,
          
        },
        errorPolicy: "all",
        context: {
          useMultipart: true,
          headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
        }
      }))
    }
    else{
      return (this.apollo.mutate<any>({
        mutation: UpDateUser,
        variables: {
          file: file,
          name: name,
          age: age
        },
        errorPolicy: "all",
        context: {
          useMultipart: true,
          headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
        }
      }))
    }
   
  }


}