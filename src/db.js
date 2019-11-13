import firebase from 'firebase/app'
import 'firebase/firestore'

let config = {
    apiKey: "AIzaSyAw08BGWXCy2kliRZbpu9n7C7_KzUluGhs",
    authDomain: "wannistalex.firebaseapp.com",
    databaseURL: "https://wannistalex.firebaseio.com",
    projectId: "wannistalex",
    storageBucket: "wannistalex.appspot.com",
    messagingSenderId: "41845371386",
    appId: "1:41845371386:web:d03f898684459830673443"
  };
export const db = firebase
  .initializeApp(config)
  .firestore()

const TimeStamp  = firebase.firestore.Timestamp
export { TimeStamp }