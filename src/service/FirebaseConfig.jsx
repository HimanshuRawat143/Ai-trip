import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBXOIdRhld2-nrITCckBbkyo4-eMjB8apI",
  authDomain: "ai-planner-84e92.firebaseapp.com",
  projectId: "ai-planner-84e92",
  storageBucket: "ai-planner-84e92.appspot.com",
  messagingSenderId: "917136312117",
  appId: "1:917136312117:web:e9314298c3bb0581282e7c",
  measurementId: "G-4PSTBMTYZQ"
};


export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
