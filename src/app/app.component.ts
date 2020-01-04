import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,

    public afAuth: AngularFireAuth,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('android')) {
        console.log('Platform Android');
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
          result => {
            console.log('Has permission?',result.hasPermission)

            if (result.hasPermission == false) {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            } else {
              console.log("User has Permission!")
            }
          },
          err => {
            alert('Location permission denied, try again?')
            console.log(err);
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
          }
        );
      }else{
        console.log('Platform IOS or Browser');
      }

      if (window.location.pathname !== "/admin"){
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigateByUrl('/tabs');
          }else{
            this.router.navigateByUrl('/login');
          }
        });
      }


    });
  }
}
