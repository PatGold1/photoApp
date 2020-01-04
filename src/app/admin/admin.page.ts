import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  allImagesCollection: any;
  singleUsersCollection: any;
  userImages: any;
  step2: any;

  constructor(
    public fireStore: AngularFirestore,
    public location: Location
  ) {
    this.allImagesCollection = this.fireStore.collection('Users').valueChanges().subscribe(values => {
      let allImagesCollection = [];

      values.forEach(user => {
        //console.log(user);

        if(user){
          this.singleUsersCollection = this.fireStore.collection('Users/' + user['uid'] + '/images').valueChanges().subscribe(values => {
            //console.log(values)

            values.forEach(image => {
              allImagesCollection.push(image)
            });
          });
        }

      });


      setTimeout(()=> {
        console.log(allImagesCollection);
        this.userImages = allImagesCollection;
        this.userImages = this.userImages.sort((a,b) => b['date']-a['date'])

        if(this.allImagesCollection)
        this.allImagesCollection.unsubscribe();
        if(this.singleUsersCollection)
        this.singleUsersCollection.unsubscribe();
      }, 1000)


    });
  }

  ngOnInit() {
  }

  deleteItem(image) {
    var photoURL = this.fireStore.doc('Users/' +  image['userID']  + '/images/' + image['imageID']);
    photoURL.delete();

    console.log('Image Removed!');

    setTimeout(() => {
      location.reload();
    }, 1000);

  }

  approveItem(image) {
    var photoURL = this.fireStore.doc('Users/' + image['userID'] + '/images/' + image['imageID']);
    photoURL.set({
      approved: true
    }, {
      merge: true
    });

    console.log('Image approved!');
    setTimeout(() => {
      location.reload();
    }, 1000);

  }

  nextStep() {
    if(this.step2) {
      this.step2 = false;
    } else {
      this.step2 = true;
    }
  }

  routeHome(){
    this.location.back();
  }

}
