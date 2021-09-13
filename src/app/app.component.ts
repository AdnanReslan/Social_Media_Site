import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from './shared/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private token: Token, private route: Router) { }

  title = 'ftest';

  ngOnInit(): void {
   
    /* onload function for keep token saved */
    onload = () => {
      if (localStorage.getItem('token')&&this.token.Islogin && sessionStorage.getItem('Islogin')) 
      {
        this.token.Islogin.next(true);
      }
    }
    if(localStorage.getItem('token') && !sessionStorage.getItem('Islogin')){
      this.token.Islogin.next(true);
      this.route.navigate(['main-page']);
      sessionStorage.setItem('Islogin','true')
    }
  }


}
