import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AngularFireAuth } from '@angular/fire/auth';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  step2: any;
  loading: any;
  loginInputs: any = {
    email: '',
    password: ''
  }

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    public loadingController: LoadingController,
    private authService: AuthProvider,
    public plt: Platform,
    private location: Location
  ) { }

  ngOnInit(){}

  signInSuccess() {
  }

  signIn() {
    this.router.navigateByUrl('tabs');
  }

  async presentLoading() {
      this.loading = await this.loadingController.create({
        message: 'Logging you in...'
      });
      await this.loading.present();

      const { role, data } = await this.loading.onDidDismiss();
      console.log('Loading dismissed!');
      //location.reload();
    }

    async dismissLoader() {
      return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }

    facebookLogin(){
      this.presentLoading();
      //console.log(this.plt);

      if (this.plt.url() !== 'http://localhost:8100/login') {
        this.authService.loginWithFacebook().then(res=>{
          this.successfulLogin(res);
        }).catch(err=>{
          this.loginFailure(err)
        })
      }else{
        this.authService.loginWithLegacyFacebook().then(res=>{
          this.successfulLogin(res);
        }).catch(err=>{
          this.loginFailure(err)
        })
      }
    }

    googleLogin(){
      this.presentLoading();
      //console.log(this.plt);

      if (this.plt.url() !== 'http://localhost:8100/login') {
        this.authService.loginWithGoogle().then(res=>{
          this.successfulLogin(res);
        }).catch(err=>{
          this.loginFailure(err)
        })
      }else{
        this.authService.loginWithLegacyGoogle().then(res=>{
          this.successfulLogin(res);
        }).catch(err=>{
          this.loginFailure(err)
        })
      }

    }

    loginButton(){
      this.presentLoading();

      if(this.loginInputs.email && this.loginInputs.password){
        console.log('Logging in...');
        console.log(this.loginInputs);

        this.authService.emailLogin(this.loginInputs['email'], this.loginInputs['password']).then(res=>{
          this.successfulLogin(res);
        }).catch(err=>{
          this.authService.emailSignup(this.loginInputs['email'], this.loginInputs['password']).then(res=>{
            this.successfulLogin(res);
          }).catch(err=>{
            this.loginFailure(err)
          })
        })
      }else if(this.loginInputs.email && !this.loginInputs.password){
        alert('Password is missing or invalid');
      }else if(this.loginInputs.password && !this.loginInputs.email){
        alert('Email is missing or invalisd');
      }

    }

    successfulLogin(res){
      console.log(res);

      setTimeout(() => {
        this.dismissLoader();
        this.router.navigateByUrl('/tabs');
      }, 500);

    }

    loginFailure(error){
      alert(error);

      setTimeout(() => {
        this.dismissLoader();
      }, 500);
    }

    nextStep() {
      if(this.step2) {
        this.step2 = false;
      } else {
        this.step2 = true;
      }
    }
}
