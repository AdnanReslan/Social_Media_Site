import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';                  //api
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import { HeaderAComponent } from './header-a/header-a.component';
import { LogInComponent } from './log-in/log-in.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatPostComponent } from './main-page/creat-post/creat-post.component';
import { PostMainComponent } from './main-page/post-main/post-main.component';
import { StoryComponent } from './main-page/story/story.component';
import { PostComponent } from './profile/post/post.component';
import { Token } from './shared/token.service';
import { AuthGuardService } from './shared/auth-guard/auth-guard.service';
import {InputTextModule} from 'primeng/inputtext';
import { PasswordModule } from "primeng/password";
import {CarouselModule} from 'primeng/carousel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OtherprofileComponent } from './otherprofile/otherprofile.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderAComponent,
    LogInComponent,
    MainPageComponent,
    NotFoundComponent,
    ProfileComponent,
    SignInComponent,
    CreatPostComponent,
    PostMainComponent,
    StoryComponent,
    PostComponent,
    OtherprofileComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    AccordionModule,
    BrowserAnimationsModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    CarouselModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    RippleModule,
    NgbModule
    
  ],
  providers: [Token,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
