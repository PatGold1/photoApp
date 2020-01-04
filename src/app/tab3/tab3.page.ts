import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverComponent } from '../popover/popover.component'

import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    user: any;
    myUserImages:any

    constructor(
      public popoverCtrl: PopoverController,
      public afAuth: AngularFireAuth,
      public fireStore: AngularFirestore
    ) {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.user = user;

            this.fireStore.collection('Users/' + user['uid'] + '/images').valueChanges().subscribe(values => {
              this.myUserImages = values;
              console.log(this.myUserImages);
            });

        }
      });


    }

   async showPopOver(ev: any) {
     const popover = await this.popoverCtrl.create({
         component: PopoverComponent,
         event: ev
     });
     return await popover.present();
 }
}
