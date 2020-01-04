import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {}

  async showAdminSection() {
    let alert = await this.alertCtrl.create({
      inputs: [
        {
          name: 'username',
          placeholder: 'Username',
          type: 'text'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Login',
          handler: data => {
            if (data['username'] == 'admin' && data['password'] == '1234') {
              console.log('YOUR ALLOWED IN')

              this.router.navigateByUrl('/admin')
            } else {
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
 }


  signOut() {
    this.afAuth.auth.signOut();
    location.reload();
  }
}
