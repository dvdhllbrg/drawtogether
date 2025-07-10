import { initializeApp } from 'firebase/app'
import { Blob, FieldValue, getFirestore, collection } from 'firebase/firestore'

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.VUE_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}.appspot.com`
}

const app = initializeApp(config)

const db = getFirestore(app)
const gamesCollection = collection(db, 'games')

export default {
  db,
  gamesCollection,
  FieldValue,
  Blob
}
