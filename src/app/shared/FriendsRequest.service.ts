import { HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Apollo, gql } from "apollo-angular"
import { Token } from "./token.service"

const SendFriendRequest = gql` mutation sendFriendRequest($userId: ID!) {
    sendaFriendRequest(id: $userId){
      _id
      name
      imageUrl
    }
  }`

const AcceptFriendRequest = gql`mutation acceptFriendRequest($userId: ID!) {
    acceptFriendRequest(id: $userId){
      _id
      name
      imageUrl
    }
  }`

const RejectFriendRequest = gql`mutation rejectFriendRequest($userId: ID!){
    rejectFriendRequest(id: $userId){
      _id
      name
      imageUrl
    }
  }`

const DeleteFriendRequestSent = gql`mutation deleteFriendRequestSent($userId: ID!){
    deleteFriendRequestSent(id: $userId){
      _id
      name
      imageUrl
    }
  }`

const DeleteFriend = gql`mutation deleteFriend($userId: ID!){
    deleteFriend(id: $userId){
      _id
      name
      imageUrl
    }
  }`
@Injectable({ providedIn: 'root' })

export class FriendsRequest {
    constructor(private apollo: Apollo, private token: Token){}

    onSendFriendRequest(id: string) {
        return (this.apollo.mutate<any>({
          mutation: SendFriendRequest,
          variables: {
            userId: id,
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        })
        )
      }



      onAcceptFriendRequest(id: string) {
        return (this.apollo.mutate<any>({
          mutation: AcceptFriendRequest,
          variables: {
            userId: id,
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        })
        )
      }


      onRejectFriendRequest(id: string) {
        return (this.apollo.mutate<any>({
          mutation: RejectFriendRequest,
          variables: {
            userId: id,
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        })
        )
      }

      onDeleteFriendRequestSent(id: string) {
        return (this.apollo.mutate<any>({
          mutation: DeleteFriendRequestSent,
          variables: {
            userId: id,
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        })
        )
      }


      onDeleteFriend(id: string) {
        return (this.apollo.mutate<any>({
          mutation: DeleteFriend,
          variables: {
            userId: id,
          },
          errorPolicy: "all",
          context: {
            useMultipart: true,
            headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
          }
        })
        )
      }
    

}