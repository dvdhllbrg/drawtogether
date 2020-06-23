import firebase, { firestore } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.VUE_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}.appspot.com`
}

firebase.initializeApp(config)

const db = firebase.firestore()
const gamesCollection = db.collection('games')

export default {
  db,
  gamesCollection,
  FieldValue: firestore.FieldValue,
  Blob: firestore.Blob
}
