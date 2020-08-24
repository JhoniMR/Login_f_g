import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth : AngularFireAuth, private router : Router, private db : AngularFirestore, 
              private google: GooglePlus, private fb: Facebook ) { }

  login(email:string, password:string){

    return new Promise((resolve, rejected) =>{
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user);
      }).catch(err => rejected(err));
    });

   
  }

  logout(){
    this.AFauth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

  register(email : string, password : string, name : string){

    return new Promise ((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email, password).then( res =>{
          // console.log(res.user.uid);
        const uid = res.user.uid;
          this.db.collection('users').doc(uid).set({
            name : name,
            uid : uid
          })
        
        resolve(res)
      }).catch( err => reject(err))
    })
    

  }

  loginWithGoogle(){
   return  this.google.login({}).then(result =>{
      const user_data = result;
      return  this.AFauth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(null, user_data.accesToken));
    })
  }

  loginWithFacebook(){
   return this.fb.login(['email','public_profile']).then((response: FacebookLoginResponse)=>{
    const credential_fb = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
   return this.AFauth.auth.signInWithCredential(credential_fb);
   })
  }

}