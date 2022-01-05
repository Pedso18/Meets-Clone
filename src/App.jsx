import './App.css';
import BottomBar from './bottomBar';
import { socket, SocketContext } from './webSocket';
import { useState, useEffect } from "react";
import Chat from './chat';
import OwnVideo from './ownVideo';

function App() {

  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [camera, setCamera] = useState(false);
  const [voice, setVoice] = useState(false);
  const [otherUsers, setOtherUsers] = useState(0);
  const [otherIds, setOtherIds] = useState([]);

  useEffect(() => {
    
    socket.on("message", e => {
      let lastArr = messages;
      lastArr.push(e);
      setMessages([...lastArr]);
    });

    socket.on("id", e => {
      let newIds = otherIds;
      newIds.push(e);
      setOtherIds([...newIds]);
    });
    
    socket.on("idDeath", e => {
      let newIds = otherIds;
      for(let i = 0; i < newIds.length; i++){
        if(newIds[i] == e){
          newIds.splice(i, 1);
          break;
        }
      }
      setOtherIds([...newIds]);
    });

    socket.on("users", e => {
      
      setOtherUsers(e - 1);

    });
    
    socket.on("videoDeath", e => {
      let element = document.querySelector(`#a${e}`);
      element.src = null;
    });

    socket.on("video", e =>{

      let element = document.querySelector(`#a${e.from}`);

      if(element){

        element.src = e.video;

      }

    });

  }, []);

  return (
    <SocketContext.Provider value={{socket: socket, messages: messages, camera: [camera, setCamera], voice: [voice, setVoice], amount: otherUsers}}>
      <div className='main' style={{position: "absolute", width: chat ? "70%" : "100%", overflow: "hidden"}}>

        <OwnVideo/>


        {otherIds.map((e, i) => 
        
          <div className='video' key={i}>
            
            <img width={"auto"} height={"100%"} id={`a${e}`}></img>

          </div>
        
        
        )}
      
        <BottomBar chat={[chat, setChat]}/>

      </div>
      {chat ? <Chat messages={messages} chat={[chat, setChat]}/> : null}

    </SocketContext.Provider>
  );
}

export default App;