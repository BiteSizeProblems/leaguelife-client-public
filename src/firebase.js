import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCl1xuS_WxavzlZQ9z70myonQACM68DWCc",
  authDomain: "league-life.firebaseapp.com",
  projectId: "league-life",
  storageBucket: "league-life.appspot.com",
  messagingSenderId: "769333615337",
  appId: "1:769333615337:web:f7ce776a8f2f8ed64fee78",
  measurementId: "G-MYNG8Y294C"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);