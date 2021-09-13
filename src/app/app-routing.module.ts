import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OtherprofileComponent } from './otherprofile/otherprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './shared/auth-guard/auth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {path:'',redirectTo:'/login', pathMatch:'full'},
  {path:'signup',component:SignInComponent },
  {path:'login',component:LogInComponent},
  {path:'myprofile',canActivate:[AuthGuardService],component:ProfileComponent},
  {path:'main-page',canActivate:[AuthGuardService],component:MainPageComponent},
  {path:'profile/:username/:id',canActivate:[AuthGuardService],component:OtherprofileComponent},
  {path: 'not-found' , component:NotFoundComponent },
  {path: '**' , redirectTo:'/not-found' }

 
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
