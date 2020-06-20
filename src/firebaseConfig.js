import firebase, { firestore } from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyDZJ6uu0_iubNZooUe-wgc41gjK0o8E2EQ',
  authDomain: 'drawtogether-7e5e2.firebaseapp.com',
  databaseURL: 'https://drawtogether-7e5e2.firebaseio.com',
  projectId: 'drawtogether-7e5e2',
  storageBucket: 'drawtogether-7e5e2.appspot.com',
  messagingSenderId: '852804341149',
  appId: '1:852804341149:web:56d128064ee328ab22b374'
}

firebase.initializeApp(config)

const db = firebase.firestore()
const gamesCollection = db.collection('games')
const fieldValue = firestore.FieldValue

export default {
  db,
  gamesCollection,
  fieldValue
}
