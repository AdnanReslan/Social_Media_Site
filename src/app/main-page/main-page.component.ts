import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private _document: Document) { }
 i=true;
  ngOnInit(): void {
    if(sessionStorage.getItem('relode')){
       this._document.defaultView!.location.reload();
       sessionStorage.removeItem('relode');
    }
    

  }

}
