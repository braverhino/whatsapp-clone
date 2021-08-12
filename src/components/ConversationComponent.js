import React, {useState} from 'react';
import styled from "styled-components";
import {SearchContainer, SearchInput} from "./ContactListComponent";
import EmojiPicker from "emoji-picker-react";
import {createMessage, deleteChat, deleteMessage, getMessagesByChatId, updateChat} from "../config/firebase";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 3;
`

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #ededed;
  padding: 10px;
  align-items: center;
  gap: 10px;
`

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`

const ChatBox = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  bottom: 0;
  background: #f0f0f0;
`
const EmojiImage = styled.img`
  width: 28px;
  height: 28px;
  opacity: 0.4;
  cursor: pointer;
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #e5ddd6;
  overflow-y: auto;
`
const MessageDiv = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isYours ? "flex-start" : "flex-end")};
  margin: 5px 15px;
`

const Message = styled.div`
  position: relative;
  background: ${(props) => (props.isYours ? "white" : "#daf8cb")};
  max-width: 50%;
  word-break: break-word;
  border-radius: ${(props) => (props.isYours ? "10px 10px 10px 0" : "10px 10px 0 10px")};
  color: #303030;
  padding: 10px 45px 10px 10px;
  font-size: 14px;
`
const MessageTime = styled.span`
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 11px;
  margin-left: 5px;
`
const DeleteBtn = styled.button`
  background-image: url("https://image.flaticon.com/icons/png/512/1214/1214428.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  width: 30px;
  height: 25px;
  padding: 0;
  margin: 0px;
  border: none;
  cursor: pointer;
`
const ModalWindow = styled(Message)`
  padding: 10px;
  background: ${(props) => (props.isYours ? "#f1f1f1" : "#f1f1f1")};
`

const MessageComponent = ({messageData, user, setUpdate}) => {
  const [showModal, setModal] = useState(false)
  return (
    <MessageDiv isYours={messageData.senderId !== user.uid}>
      {
        !showModal ? (
          <Message isYours={messageData.senderId !== user.uid} onClick={() => setModal(true)}>
            {messageData.text}
            <MessageTime>{messageData.textTime}</MessageTime>
          </Message>
        ) : (
          <ModalWindow isYours={messageData.senderId !== user.uid} style={{color: 'red', fontWeight: 'bold'}}>
            <span style={{cursor: 'pointer'}} onClick={() => {
              setModal(false)
              deleteMessage(messageData.id)
              setUpdate(true)
            }}>Delete</span>
            <span style={{marginLeft: 10, color: "black", cursor: 'pointer'}} onClick={() => setModal(false)}>X</span>
          </ModalWindow>
        )
      }
    </MessageDiv>

    )
}

function ConversationComponent({selectedChat, update, setUpdate, setChat, user }) {
  const [text, setText] = useState('');
  const [pickerVisible, tooglePicker] = useState(false);
  const [messageList, setMessageList] = useState([]);

  const onEmojiClick = (event, emoji) => {
    setText(text+emoji.emoji)
  }
  const getMessages = () => {
    if (selectedChat){
      getMessagesByChatId(selectedChat.id).then((messages) => {
        setMessageList(messages)
      })
    }
  }
  if (update){
    getMessages()
    setUpdate(false)
  }
  const enterPress = (e) => {
    if (e.key === 'Enter'){
      if (text.trim()){
        const messages = [...messageList];
        let time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
        const order = {
          messageType: "TEXT",
          text,
          chatId: selectedChat.id,
          uid: selectedChat.uid,
          senderId: user.uid,
          textTime: time,
        }
        createMessage(selectedChat, order);
        setUpdate(true)
        messages.push(order)
        setMessageList(messages);
        tooglePicker(false);
        setText('')
        updateChat({...selectedChat, lastText: text, lastTextTime: time}, selectedChat.id)
      }
    }
  }

  return (
    <Container>
      <ProfileHeader>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <ProfileImage src={selectedChat.createdBy === user.uid ? selectedChat.photoUrl : selectedChat.creatorPhotoUrl} />
          {selectedChat.createdBy === user.uid ? selectedChat.displayName : selectedChat.creatorName}
        </div>
        <DeleteBtn onClick={async () => {
          await deleteChat(selectedChat.id)
          await setChat()
        }}/>
      </ProfileHeader>
      <MessageContainer>
        {messageList.map((messageData) => (
          <MessageComponent messageData={messageData} user={user} setUpdate={setUpdate}/>
        ))}
      </MessageContainer>
      <ChatBox>
        <SearchContainer>
          {pickerVisible && (
            <EmojiPicker pickerStyle={{
              position: 'absolute',
              bottom: 60
            }} onEmojiClick={onEmojiClick}/>
          )}
          <EmojiImage src="/data.svg" onClick={() => tooglePicker(!pickerVisible)} />
          <SearchInput autofocus onKeyDown={enterPress} placeholder='Type a message' value={text} onChange={(e) => setText(e.target.value)}/>
        </SearchContainer>
      </ChatBox>
    </Container>
  );
}

export default ConversationComponent;
