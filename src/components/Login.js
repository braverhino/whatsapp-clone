import React from 'react';
import styled from "styled-components";
import {auth, db} from "../config/firebase";
import firebase from "firebase";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const SignInWithGoogleBtn = styled.button`
  background: #000;
  color: white;
  border: none;
  outline: none;
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: normal;
  font-style: oblique;
  
`
const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider)
  await db.collection("users").doc(auth.currentUser.uid).set({
    uid: auth.currentUser.uid,
    displayName: auth.currentUser.displayName,
    photoUrl: auth.currentUser.photoURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  console.log(auth.currentUser)
}


function Login() {
  return (
    <Container>
        <SignInWithGoogleBtn onClick={signInWithGoogle}>
          Sign In with Google
        </SignInWithGoogleBtn>
    </Container>
  );
}

export default Login;
