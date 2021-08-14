import React, {useState} from 'react';
import styled from "styled-components";
import {SearchContainer, SearchInput} from "./ContactListComponent";
import EmojiPicker from "emoji-picker-react";
import './ConvComp.css'
import {
  createMessage,
  deleteChat,
  deleteMessage,
  editMessage,
  getMessagesByChatId,
  updateChat
} from "../config/firebase";
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
  margin-right: 1%;
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
  padding: 10px 45px 15px 15px;
  font-size: 14px;
  
  :hover button{
    display: block;
  }
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
  margin: 0;
  border: none;
  cursor: pointer;
`

const ModalWindow = styled(Message)`
  padding: 10px 40px 10px 10px;
  border-radius: 10px;
  background: black;
  color: white;
`

const MessageComponent = ({messageData, user, setUpdate, selectedChat, setText, setEdit, setMessage, isOpened, setOpen, isEdit, selectedMessage}) => {
  const [showModal, setModal] = useState(false)
  if (selectedMessage){
    if (messageData.id === selectedMessage.id){
      if (showModal)
        if (isOpened) {
          setModal(false)
          setOpen(false)
        }
    }
  }
  return (
    <MessageDiv isYours={messageData.senderId !== user.uid}>
      {
        !showModal ? (
          <Message isYours={messageData.senderId !== user.uid}>
            {messageData.text}
            <span style={{
              position: 'absolute',
              fontSize: '8px',
              bottom: '5px',
              right: '40px',
            }}>
              {
                messageData.updatedAt
                  ? "изменено" : ""
              }
            </span>
            <MessageTime>{messageData.textTime}</MessageTime>
            {
              messageData.senderId === user.uid ?
                (
                  <button className={'message_btn'} onClick={() => setModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 20" width="19" height="20">
                      <path fill="currentColor" d="M3.8 6.7l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"/>
                    </svg>
                  </button>
                ) :
                ""
            }
          </Message>
        ) :
          isEdit ? (
            <ModalWindow style={{fontWeight: 'bold', padding: 10}} onClick={() => {
              setModal(false)
              setEdit(false)
              setText('')
            }}>
              CANCEL
            </ModalWindow>
          ) : (
            <ModalWindow isYours={messageData.senderId !== user.uid} style={{fontWeight: 'bold', position: 'relative'}}>
              <span style={{cursor: 'pointer', position: 'absolute', top: 8, right: 5, border: '0.5px solid white', borderRadius: '30%', padding: 1}} onClick={() => setModal(false)}>X</span>
              <div style={{marginBottom: 5}}>
              <span style={{cursor: 'pointer'}} onClick={() => {
                setModal(false)
                if (messageData.id === selectedChat.messageId)
                  updateChat({...selectedChat, lastText: "Сообщение удалено", lastTextTime: '', messageId: ''}, selectedChat.id)
                deleteMessage(messageData.id)
                setUpdate(true)
              }}>Delete</span>
              </div>
              <div>
              <span style={{cursor: 'pointer'}} onClick={() => {
                setMessage(messageData)
                setText(messageData.text)
                setEdit(true)
              }}>
                Edit
              </span>
              </div>
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
  const [isEdit, setEdit] = useState(false)
  const [selectedMessage, setMessage] = useState()
  const [isOpened, setOpen] = useState(false);
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
        if (isEdit){
           if (selectedMessage.text !== text){
            editMessage({...selectedMessage, createdAt: selectedMessage.createdAt, text}, selectedMessage.id)
            if (selectedMessage.id === selectedChat.messageId)
              updateChat({...selectedChat,  createdAt: selectedMessage.createdAt, lastText: text}, selectedChat.id)
          }
            setOpen(true)
            setEdit(false)
            setText('')
            setUpdate(true)
        }
        else{
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
            const messageId = createMessage(selectedChat, order);
            setUpdate(true)
            messages.push(order)
            setMessageList(messages);
            tooglePicker(false);
            setText('')
            setChat({...selectedChat, messageId})
            updateChat({...selectedChat, lastText: text, lastTextTime: time, messageId}, selectedChat.id)
        }
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
          <MessageComponent messageData={messageData} user={user} setUpdate={setUpdate} selectedChat={selectedChat} setText={setText} setEdit={setEdit} setMessage={setMessage} setOpen={setOpen} isEdit={isEdit} isOpened={isOpened} selectedMessage={selectedMessage}/>
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
