import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponent";
import ConversationComponent from "./components/ConversationComponent";
import {useEffect, useState} from "react";
import Login from "./components/Login";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, getAllUsers, getChats} from "./config/firebase";
import "./App.css"
import NewContacts from "./components/NewContacts";
const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background: #f8f9fb;
`
const Placeholder = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  gap: 10px;
  span{
    font-size: 32px;
    color: #525252;
  }
`
const ChatPlaceholder = styled.img`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  object-fit: contain;
`


function App() {
  const [selectedChat, setChat] = useState()
  const [user, loading] = useAuthState(auth);
  const [newContactsShow, setNewContactsShow] = useState(false);
  const [users, setUsers] = useState([])
  const [chats, setChats] = useState();
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data)
    })
    getChats(setChats);
  }, [])
  // const [messages, setMessages] = useState([])
  //
  // if (selectedChat){
  //   let tempId = selectedChat.id
  //     console.log('tempId', tempId)
  //     console.log('selected id', selectedChat.id)
  //   if (selectedChat.id !== tempId){
  //     tempId = selectedChat.id
  //   }
  // }
  // if (selectedChat) {
  //   getMessagesByChatId(selectedChat.id).then((list) => {
  //     setMessages(list)
  //     console.log('...')
  //   })
  // }
  if(loading) {
    return (
      <>
        <div className="lds-hourglass">
        <div style={{color: '#000', position: 'absolute', bottom: -50, left: 1, fontWeight: 'bold', fontSize: 18}}>Loading...</div>
        </div>
      </>
    )
  }
  return (
    <>
      {
        user ? (
          <Container>
            {
              newContactsShow ?
                <NewContacts user={user} chats={chats} users={users} setChat={setChat} setNewContactsShow={setNewContactsShow} selectedChat={selectedChat} setUpdate={setUpdate}/> :
                <ContactListComponent setUpdate={setUpdate} setNewContactsShow={setNewContactsShow} setChat={setChat} user={user}/>
            }
            {selectedChat ? <ConversationComponent setChat={setChat} update={update} setUpdate={setUpdate} user={user} selectedChat={selectedChat} /> : <Placeholder>
              <ChatPlaceholder src={"/intro-connection-hq-light_9466a20e6d2921a21ac7ab82419be157.jpg"}/>
              <span>Keep your phone connected</span>
              WhatsApp connects to your phone to sync messages.
            </Placeholder> }
          </Container>
          ) : (
            <Login />
        )
      }
    </>
  );
}

export default App;
