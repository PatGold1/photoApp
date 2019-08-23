import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user: any;

  constructor(public afAuth: AngularFireAuth) {}


  ngOnInit(){
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log(user)
      }
    });
  }


  takePhoto() {
    console.log("photo");
  }

  uploadImage() {
    console.log("upload");
  }
}
