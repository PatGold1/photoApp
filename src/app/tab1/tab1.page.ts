import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {




  user: any;
  imgLoading: boolean;
  myUrl: string;
  information: any;

  currentUserCollection: any;




  constructor(
    public afAuth: AngularFireAuth,
    public storage: AngularFireStorage,
    public fireStore: AngularFirestore
  ) {}


  ngOnInit(){
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log(user)

        var userInDatabase = this.fireStore.doc('Users/' + this.user.uid)

        this.currentUserCollection = userInDatabase.valueChanges().subscribe(
        dbItem =>{
          console.log(this.user);

          if(dbItem){
            console.log('Welcome back ' + dbItem['name']);
            this.currentUserCollection.unsubscribe();
          }else{
            userInDatabase.set({
              name: this.user['displayName'],
              email: this.user['email'],
              pic: this.user['photoURL'],
              uid: this.user['uid']
            })

            console.log('Your information has been saved, ' + this.user.displayName);
            this.currentUserCollection.unsubscribe();
          }
        });

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
    const filePath = this.afAuth.auth.currentUser.uid + randomID;
    console.log('Saving to ' + filePath);
    const fileRef = this.storage.ref(filePath)
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
        finalize(() => {
          const downloadURL = fileRef.getDownloadURL();

          downloadURL.subscribe(url=>{
             if(url){
               console.log(url);
               this.myUrl = url;
               this.imgLoading = false;

               var geoOptions = {
                 enableHighAccuracy: true,
                 timeout: 5000,
                 maximumAge: 0
               }

               navigator.geolocation.getCurrentPosition((position) => {

                 let lat = position.coords.latitude;
                 let lng = position.coords.longitude;

                 console.log('My Position is ' + lat + ', ' + lng);
                 console.log('Location accuracy at ' + position.coords.accuracy);

                 this.fireStore.doc('Users/' + this.afAuth.auth.currentUser.uid + '/images/' + randomID)
                 .set({
                   photoURL: url,
                   imageID: randomID,
                   date: Date.now(),
                   lat: lat,
                   lng: lng,
                   approved: false,
                   userID: this.afAuth.auth.currentUser.uid
                 },{
                   merge: true
                 });

                 console.log('Image Saved, hurrah!')

               }, error => {
                 console.log(error)
               }, geoOptions);

             }
          })

        })
     )
    .subscribe();
  }

  nextStep() {
    if(this.information) {
      this.information = false;
    } else {
      this.information = true;
    }
  }

}
