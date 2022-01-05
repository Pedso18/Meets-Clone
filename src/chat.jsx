import RippleButton from "./rippleButton";
import React, { useContext, useState } from "react";
import { SocketContext } from "./webSocket";

export default function Chat(props){

    const [chat, setChat] = props.chat;

    const context = useContext(SocketContext);

    const messages = props.messages;

    return(

        <div className="chatBox">

            <RippleButton style={{position: "absolute", left: "2vh", top: "2vh", width: "5%"}} onClick={() => setChat(!chat)} children={<img src="./close.png" className='clickyImage'/>}/>

            <div className="messageBox">

                {props.messages.map((message, index) => {

                    return(
                        
                        <React.Fragment key={index}>
                            <span className="messageFrom">{message.from + ":"}<br /></span>
                            <span className="messageText">{message.text}<br/></span>
                            <br />
                        </React.Fragment>

                    )

                })}

            </div>

            <input onKeyDown={e => e.key == "Enter" ? handleSend(document.querySelector(".messageField").value) : null} type="text" className="messageField"/>

        </div>

    )

    function handleSend(text){

        context.socket.emit("message", text);
        document.querySelector(".messageField").value = '';
        
    }

}