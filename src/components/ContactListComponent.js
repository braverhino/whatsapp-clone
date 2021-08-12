import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {auth, getChats} from "../config/firebase";
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
  justify-content: space-between;
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
const MessageText = styled.span`
  width: 100%;
  font-size: 14px;
  margin-top: 3px;
  color: rgba(0, 0, 0, 0.8);
`

const MessageTime = styled.span`
  font-size: 12px;
  margin-right: 10px;
  color: rgba(0, 0, 0, 0.45);
  white-space: nowrap;
`
const NewChatBtn = styled.button`
  background-image: url("https://image.flaticon.com/icons/png/512/1380/1380338.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  width: 30px;
  border: none;
  cursor: pointer;
`
const ContactContainer = styled.div`
  overflow-y: auto;
`

const ContactComponent = ({userData, setChat, setUpdate, user}) => {
  return (
    <ContactItem onClick={() => {
      setChat(userData)
      setUpdate(true)
    }}>
      <ProfileIcon src={userData.createdBy === user.uid ? userData.photoUrl : userData.creatorPhotoUrl} />
      <ContactInfo>
        <ContactName>
          {userData.createdBy === user.uid ? userData.displayName : userData.creatorName}
        </ContactName>
        <MessageText>
          {userData?.lastText.length > 45 ? userData?.lastText.substr(0, 45) + '...' : userData?.lastText}
        </MessageText>
      </ContactInfo>
      <MessageTime>{userData?.lastTextTime}</MessageTime>
    </ContactItem>
  )
}

function ContactListComponent({setChat, user, setNewContactsShow, setUpdate}) {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    getChats(setChats);
  }, [])
  return (
    <Container>
      <ProfileInfoDiv>
        <ProfileImg src={user.photoURL} onClick={() => auth.signOut()} />
        <NewChatBtn onClick={() => setNewContactsShow(true)}/>
      </ProfileInfoDiv>
      <SearchBox>
        <SearchContainer>
          <SearchIcon src={"/search-icon.svg"} />
          <SearchInput placeholder={"Search or start new chat"}/>
        </SearchContainer>
      </SearchBox>
      <ContactContainer>
      {/* eslint-disable-next-line array-callback-return */}
      {chats.map((userData) => {
        if(userData.createdBy === user.uid || userData.uid === user.uid){
          return (
                <ContactComponent key={userData.id} user={user} setUpdate={setUpdate} setChat={setChat} userData={userData}/>
            )
        }
      })}
      </ContactContainer>
    </Container>
  );
}

export default ContactListComponent;
