import firebase from "firebase";
import 'firebase/auth';
import {firebaseConfig} from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

export function createChat(order) {
  const orderRef = db.collection("chats").doc()
  orderRef.set({
    ...order,
    id: orderRef.id,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
  return orderRef.id
}

export function getChats(callBack) {
  return db.collection("chats").orderBy('updatedAt', "desc")
    .onSnapshot((snapShot) => callBack(snapShot.docs.map((doc) => doc.data())));
}
export function updateChat(order, id) {
  const orderRef = db.collection("chats").doc(id)
  orderRef.update({
    ...order,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}
export function deleteChat(chatId) {
  db.collection("chats").doc(chatId).delete().then(() => {
    deleteAllMessagesByChatId(chatId)
  })
}

export function createMessage(chat, order) {
  const ref = db.collection("messages");
  const id = ref.doc().id + chat.id;
  const orderRef = ref.doc(id);
  return orderRef.set({
    ...order,
    id,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
export function getMessagesByChatId(chatId) {
  return db.collection('messages')
    .where('chatId', '==', chatId)
    .orderBy('createdAt', 'asc')
    .get()
    .then((snapshot) => snapshot.docs
      .map((doc) => doc.data()));
}

export function deleteAllMessagesByChatId(chatId) {
  const orderRef = db.collection("messages").where('chatId', '==', chatId)
  orderRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      doc.ref.delete();
    })
  })
}
export function deleteMessage(messageId) {
  const orderRef = db.collection("messages").doc(messageId)
  orderRef.delete()
}

export function getAllUsers() {
  return db.collection("users")
    .get()
    .then((snapshot) => snapshot.docs
      .map((doc) => doc.data()));
}

// export default firebase;
