import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

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

    signOut() {
      this.afAuth.auth.signOut().then(() => {
        location.reload();
      });
    }
}
