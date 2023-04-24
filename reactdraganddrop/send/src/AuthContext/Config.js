// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyAX86W2E3PUCX83FRO-1PC4PkluVAJFTrY",
  authDomain: "pro-one-902c9.firebaseapp.com",
  projectId: "pro-one-902c9",
  storageBucket: "pro-one-902c9.appspot.com",
  messagingSenderId: "413933142403",
  appId: "1:413933142403:web:e7f5c3c0ba5522185376b6",
  measurementId: "G-LQ5DSRW8J8"
};


const app = initializeApp(firebaseConfig);
const authGoogle = getAuth(app);
const provider=new GoogleAuthProvider();
export {authGoogle,provider}