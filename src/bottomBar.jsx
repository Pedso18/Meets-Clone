import RippleButton from './rippleButton';
import { useState } from 'react';

export default function BottomBar(props){

    const [microphone, setMicrophone] = useState(false);
    const [camera, setCamera] = useState(false);
    const [chat, setChat] = props.chat;

    return(

        <div className="bottomBar">

            <RippleButton style={{position: "absolute", right: "2%"}} onClick={() => setChat(!chat)} children={<img src="./message.png" className='clickyImage'/>}/>
            
            <RippleButton style={{backgroundColor: "#BF2A20"}} onClick={() => setMicrophone(!microphone)} children={<img src={`./voice-${microphone ? "on" : "off"}.png`} className='clickyImage'/>}/>
            <RippleButton style={{backgroundColor: "#BF2A20"}} onClick={() => console.log("wow")} children={<img src="./phone.png" className='clickyImage'/>}/>
            <RippleButton style={{backgroundColor: "#BF2A20"}} onClick={() => setCamera(!camera)} children={<img src={`./camera-${camera ? "on" : "off"}.png`} className='clickyImage'/>}/>

        </div>

    );

}