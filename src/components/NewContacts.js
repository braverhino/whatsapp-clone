import React from 'react';
import styled from "styled-components";
import {createChat} from "../config/firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1.6;
  border-right: 1px solid #dadada;
`
const ProfileInfoDiv = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
`
const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
`

const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  background: #f6f6f6;
  padding: 10px;
`
export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 16px;
  width: 100%;
  padding: 5px 10px;
  gap: 10px;
`

const SearchIcon = styled.img`
  width: 28px;
  height: 28px;
`

export const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 15px;
`
const ContactItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  //width: 100%;
  border-bottom: 1px solid #f2f2f2;
  background: white;
  cursor: pointer;
  padding: 15px 12px;
  
  :hover{
    background: #ebebeb;
  }
`
const ProfileIcon = styled(ProfileImg)`
  width: 38px;
  height: 38px;
`
const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 12px;
`
const ContactName = styled.span`
  width: 100%;
  font-size: 16px;
  color: black;
`
const GoBackBtn = styled.button`
  background-image: url("https://image.flaticon.com/icons/png/512/545/545680.png");
  background-size: contain;
  background-color: transparent;
  background-repeat: no-repeat;
  width: 30px;
  height: 25px;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;
`
const ContactComponent = (props) => {
  const
    {userData, setNewContactsShow, chats, setChat, user, setUpdate}
      = props
  let alreadyExist = false
  let chatData = {}
  const order = {
    uid: userData.uid,
    createdBy: user.uid,
    creatorName: user.displayName,
    creatorPhotoUrl: user.photoURL,
    displayName: userData.displayName,
    photoUrl: userData.photoUrl,
    lastText: "",
    lastTextTime: "",
  }
  // eslint-disable-next-line array-callback-return
  chats.map((chat) => {
    if ((userData.uid === chat.uid && user.uid === chat.createdBy) || (user.uid === chat.uid && userData.uid === chat.createdBy)){
      alreadyExist = true;
      chatData = {...chat}
      // eslint-disable-next-line no-sequences
      return alreadyExist, chatData;
    }
  })


  return (
    <ContactItem onClick={ async () => {
      if (!alreadyExist){
        let id = createChat(order)
        await setChat({...userData, id, createdBy: user.uid})
        await setNewContactsShow(false)
        setUpdate(true)
      }else{
        await setChat({...chatData})
        await setNewContactsShow(false)
        setUpdate(true)
      }
    }}>
      <ProfileIcon src={userData.photoUrl} />
      <ContactInfo>
        <ContactName>
          {userData.displayName}
        </ContactName>
      </ContactInfo>
    </ContactItem>
  )
}

function NewContacts({setChat, setNewContactsShow, users, chats, user, setUpdate}) {

  return (
    <Container>
      <ProfileInfoDiv>
        <GoBackBtn onClick={() => setNewContactsShow(false)}/>
      </ProfileInfoDiv>
      <SearchBox>
        <SearchContainer>
          <SearchIcon src={"/search-icon.svg"} />
          <SearchInput placeholder={"Search or start new chat"}/>
        </SearchContainer>
      </SearchBox>
      {/* eslint-disable-next-line array-callback-return */}
      {users.map((userData) => {
        if(userData.uid !== user.uid){
          return (
              <ContactComponent key={userData.uid} user={user} chats={chats} setNewContactsShow={setNewContactsShow} setChat={setChat} setUpdate={setUpdate} userData={userData}/>
            )
        }
      })}
    </Container>
  );
}

export default NewContacts;
