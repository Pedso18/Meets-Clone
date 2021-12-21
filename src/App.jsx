import './App.css';
import BottomBar from './bottomBar';
import { socket, SocketContext } from './webSocket';
import { useState, useEffect } from "react";
import Chat from './chat';

function App() {

  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    
    socket.on("message", e => {
      let lastArr = messages;
      lastArr.push(e);
      setMessages([...lastArr]);
    });

  }, []);

  return (
    <SocketContext.Provider value={{socket: socket, messages: messages}}>
      <div className='main' style={{position: "absolute", width: chat ? "70%" : "100%", overflow: "hidden"}}>
      
        <BottomBar chat={[chat, setChat]}/>

      </div>
      {chat ? <Chat messages={messages} chat={[chat, setChat]}/> : null}

    </SocketContext.Provider>
  );
}

export default App;