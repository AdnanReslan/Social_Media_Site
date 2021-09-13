import { HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { gql, Apollo } from "apollo-angular"
import { Token } from "./token.service"

const GetMe = gql`query getMe {
    getMe {
      _id
      name
      email
      imageUrl
      age
     
      friends {
        friendsData {
          _id
          name
          imageUrl
          
        }
        friendsCount 
      }
      friendRequestsReceived {
        _id
        name
        imageUrl
        isFriends
        doISentHimFriendRequest
        doHeSentMeFriendRequest
        
      }
      friendRequestsSent {
        _id
        name
        imageUrl
        isFriends
      doISentHimFriendRequest
      doHeSentMeFriendRequest
      }
      posts {
        _id
        description
        filesUrl
        createdAt
        author {
          _id
          name
          imageUrl
        }
        likes{
          _id
          name
          imageUrl
        }
        disLikes {
          _id
          name
          imageUrl
        }
        loves {
          _id
          name
          imageUrl
        }
        myReaction
        likesCount
        disLikeCount
        lovesCount  
      }
    }
  }`

const myPostsMain = gql`query getPosts {
    getPostsOnFriends{
      _id
      description
      filesUrl
      createdAt
      author {
        _id
        name
        imageUrl
      }
      likes {
        _id
        name
        imageUrl
      }
      disLikes {
        _id
        name
        imageUrl
      }
      loves {
        _id
        name
        imageUrl
      }
      likesCount
      lovesCount
      disLikeCount 
      myReaction
    }
  }`

const getProfile = gql` query getProfile($userId: ID!) {
    getProfile(userId: $userId) {
      _id
      name
      imageUrl
      posts {
        _id
        description
        filesUrl
        createdAt
        likesCount
        lovesCount
        disLikeCount
        myReaction
        author {
          _id
          name
          imageUrl
        }
      }
      mutualFriends {
        mutualFriendsData {
          _id
          name
          imageUrl
          isFriends
          doISentHimFriendRequest
          doHeSentMeFriendRequest
        }
        mutualFriendsCount
      }
      friends {
        friendsData {
          _id
          name
          imageUrl
          isFriends
          doISentHimFriendRequest
          doHeSentMeFriendRequest
        }
        friendsCount
      }
      isFriends
      doISentHimFriendRequest
      doHeSentMeFriendRequest
    }
  }`
@Injectable({ providedIn: 'root' })

export class PagesRequeat {

  constructor(private apollo: Apollo, private token: Token) {
  }
  onGetMe() {
    return (this.apollo.watchQuery<any>({
      query: GetMe,
      errorPolicy: "all",
      context: {
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    }))
  }

  onGetMypostsMain() {
    return (this.apollo.watchQuery<any>({
      query: myPostsMain,
      errorPolicy: "all",
      context: {
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    }))
  }

  onGetProfile(id: string) {
    return (this.apollo.watchQuery<any>({
      query: getProfile,
      variables: {
        userId: id
      },
      errorPolicy: "all",
      context: {
        headers: new HttpHeaders().set("Authorization", this.token.get_token()!)
      }
    }))
  }


}