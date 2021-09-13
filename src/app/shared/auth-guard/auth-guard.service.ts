import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Token } from '../token.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private token : Token , private router : Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.token.Islogin&&localStorage.getItem('token')){
      return true;
    }
     else{
      this.router.navigate(['/']);
      return false;
     }
  }
}
