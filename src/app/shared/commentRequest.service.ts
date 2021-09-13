import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Token } from "./token.service";



const creatcomment = gql`mutation createComment($fileUrl: Upload , $text: String! , $postId: ID!){
    createComment(data: {fileUrl:$fileUrl, text:$text , postId: $postId}){
      text
      _id
      author{
        _id
        name
      }
    }
  }`
  
  const getscomment = gql`query getCommentsForPost($id: ID!) {
      getCommentForPost(postId: $id){
        _id
        text
        fileUrl
        author {
          _id
          name
          imageUrl
        }
        
      }
    }`

const commentsubscribe = gql`subscription comment($postID: ID!){
    comment(postID: $postID){
      mutation
      data {
        text
        _id
        author {
          _id
          name
        }
      }
    }
  }`
  
  const deletecomment = gql`mutation deleteComment($id:ID!){
      deleteComment(commentId:$id){
        text
        _id
        author{
          _id
          name
        }
        post {
          _id
          description
        }
      }
    }`
  
  const ubdateComment = gql`mutation updateComment($commentId: ID!, $text: String!, $fileUrl: Upload) {
      updateComment(commentId: $commentId , data: { text: $text, fileUrl: $fileUrl}) {
        text
        _id
        fileUrl
        author {
          _id
          name
          imageUrl
        }
      }
    }`
  
@Injectable({ providedIn: 'root' })

export class CommentRequest {
 
    constructor(private apollo: Apollo, private token: Token){}


    onAddComment(id: string, text: string, filee: File) {
        return (this.apollo.mutate<any>({
          mutation: creatcomment,
          variables: {
            text: text,
            postId: id,
            fileUrl: filee
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        }))
      }

      onDeleteComment(id: string) {
        return (this.apollo.mutate<any>({
          mutation: deletecomment,
          variables: {
            id: id
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        }))
      }
      
      onUpdateComment(id: string, text: string, file: File) {
        return (this.apollo.mutate<any>({
          mutation: ubdateComment,
          variables: {
            commentId: id,
            text: text,
            fileUrl: file
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        }))
      }

      onGetComment(id: string) {
        return (this.apollo.watchQuery<any>({
          query: getscomment,
          variables: {
            id: id
          },
          errorPolicy: "all",
          context: {
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        }))
      }
    
}