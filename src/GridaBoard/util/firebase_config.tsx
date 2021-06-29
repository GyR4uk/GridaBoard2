import firebase from "firebase";
// import firebase2 from "firebase";


//neostudio staging
// const firebaseConfig = {
//   apiKey: "AIzaSyD7Yh_sCRUO-vmsF5dURj5xOLBeP8ekVto",
//   authDomain: "neostudio-staging.firebaseapp.com",
//   databaseURL: "https://neostudio-staging.firebaseio.com",
//   // databaseURL: "https://gridaboard-v2-test-default-rtdb.asia-southeast1.firebasedatabase.app/",
//   projectId: "neostudio-staging",
//   storageBucket: "neostudio-staging.appspot.com",
//   // storageBucket: "gridaboard-v2-test.appspot.com",
//   messagingSenderId: "382410551029",
//   appId: "1:382410551029:web:9fa2a23bfc9c7e3f955fbc"
// };

//v2 test
const firebaseConfig = {
  apiKey: "AIzaSyCQ7i4k-LLa4nEVv8zi9inyT7T68l0-1RI",
  authDomain: "gridaboard-v2-test.firebaseapp.com",
  projectId: "gridaboard-v2-test",
  databaseURL: "https://gridaboard-v2-test-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "gridaboard-v2-test.appspot.com",
  messagingSenderId: "380346205591",
  appId: "1:380346205591:web:d1148a041c72a385dcf0d2",
  measurementId: "G-K6TXR3674W"
};

//v2 dev
// const firebaseConfig = {
//   apiKey: "AIzaSyBZehYzHuEQM59oXiJVgXGigSTfKQeyDQQ",
//   authDomain: "gridaboard-v2-dev.firebaseapp.com",
//   projectId: "gridaboard-v2-dev",
//   storageBucket: "gridaboard-v2-dev.appspot.com",
//   messagingSenderId: "899078621847",
//   appId: "1:899078621847:web:4d8b9a562e57e737e1f7d2"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase2.initializeApp(firebaseConfig2);

export const auth = firebase.auth();
// export const firestore = firebase2.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

const AppleAuthProvider = new firebase.auth.OAuthProvider('apple.com')

provider.setCustomParameters({prompt:"select_account"});

export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signInWithApple = () => auth.signInWithPopup(AppleAuthProvider)

export default firebase;