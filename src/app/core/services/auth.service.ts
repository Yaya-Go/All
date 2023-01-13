import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Router } from '@angular/router';
import { doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  userName = new BehaviorSubject<string>('');

  constructor(
    public firestore: Firestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.userName.next(user?.displayName ? user.displayName : (user?.email?.split('@')[0] || ''));
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        this.router.navigate(['login']);
      }
    });
  }
  // Sign in with email/password
  SignIn(auth: {email: string, password: string}) {
    return this.afAuth
      .setPersistence('local')
      .then(() => {
        return this.afAuth
          .signInWithEmailAndPassword(auth.email, auth.password)
          .then((result) => {
            this.SetUserData(result.user);
            this.afAuth.authState.subscribe((user) => {
              if (user) {
                this.router.navigate(['home']);
              }
            });
          })
          .catch((error) => {
            window.alert(error.message);
          });
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string, displayName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        return result.user?.updateProfile({ displayName })
          .then(() => {
            /* Call the SendVerificaitonMail() function when new user sign 
            up and returns promise */
            this.SendVerificationMail();
            this.SetUserData(result.user);
          });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigateByUrl('/auth/verify-email-address');
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string, isChange: boolean = false) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
        if (!isChange) {
          this.router.navigateByUrl('/auth/login');
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  get user() {
    return this.afAuth.authState;
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && (user.emailVerified !== false ? true : false);
  }
  get useId(): string {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user.uid;
  }
  get token(): string {
    return localStorage.getItem('token')!;
  }
  
  // // Sign in with Google
  // GoogleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
  //     this.router.navigate(['home']);
  //   });
  // }
  // // Auth logic to run auth providers
  // AuthLogin(provider: any) {
  //   return this.afAuth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       this.router.navigate(['home']);
  //       this.SetUserData(result.user);
  //     })
  //     .catch((error) => {
  //       window.alert(error);
  //     });
  // }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef = doc(this.firestore,
      `users/${user.uid}`
    );
    const userData: User = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    };
    return setDoc(userRef, userData, { merge: true });
  }
  // Sign out
  SignOut() {
    this.afAuth.signOut().then(() => {
      this.userName.next('');
      localStorage.removeItem('user');
      setTimeout(() => {
        this.router.navigateByUrl('/auth/login');
      })
    });
  }

  updateDisplayName(displayName: string) {
    return this.afAuth.authState.subscribe((user) => {
      return user?.updateProfile({ displayName })
        .then(() => {
          this.userName.next(displayName);
          this.SetUserData(user);
          localStorage.setItem('user', JSON.stringify(user));
          JSON.parse(localStorage.getItem('user')!);
          window.alert('You have update your Display Name successfully.');
        });
    });
  }
}