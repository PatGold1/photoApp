import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {




  user: any;
  imgLoading: boolean;
  myUrl: str;




  constructor(
    public afAuth: AngularFireAuth,
    public storage: AngularFireStorage
  ) {}


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

  uploadImage(event) {
    this.imgLoading = true;

    const file = event.target.files[0];
    let randomID = Math.floor(Math.random() * 1000);
    const filePath = this.afAuth.auth.currentUser.uid + '/' + randomID;
    const fileRef = this.storage.ref(filePath)
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
        finalize(() => {
          const downloadURL = fileRef.getDownloadURL();

          downloadURL.subscribe(url=>{
             if(url){
               this.loadingImageUpload = false;
               console.log(url);
               this.myUrl = url;
               this.imgLoading = false;





               //
               //  this.fireStore.doc('Users/' + this.afAuth.auth.currentUser.uid + '/tanks/' + this.activeTankData['name'])
               //  .set({
               //    photoURL: url
               //  },{
               //    merge: true
               //  });
             }
          })

        })
     )
    .subscribe()
  }


}
