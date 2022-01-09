import RippleButton from './rippleButton';
import { useState, useContext } from 'react';
import { SocketContext } from './webSocket';

export default function BottomBar(props){

    const context = useContext(SocketContext);

    const [microphone, setMicrophone] = context.voice;
    const [camera, setCamera] = context.camera;
    const [chat, setChat] = props.chat;
    const [mediaRecorderState, setMediaRecorderState] = useState(null);
    const [streamState, setStreamState] = useState(null);

    return(

        <div className="bottomBar">

            <RippleButton style={{position: "absolute", right: "2%"}} onClick={() => setChat(!chat)} children={<img src="./message.png" className='clickyImage'/>}/>
            
            <RippleButton style={{backgroundColor: "#BF2A20"}} onClick={() => {setAudio()}} children={<img src={`./voice-${microphone ? "on" : "off"}.png`} className='clickyImage'/>}/>
            <RippleButton style={{backgroundColor: "#BF2A20"}} onClick={() => closeWindow()} children={<img src="./phone.png" className='clickyImage'/>}/>
            <RippleButton style={{backgroundColor: "#BF2A20"}} onClick={() => setCamera(!camera)} children={<img src={`./camera-${camera ? "on" : "off"}.png`} className='clickyImage'/>}/>

        </div>

    );
    

    function closeWindow(){
        if(window.confirm("Close Window?")){
            
            window.location.href = "https://google.com";
        
        } 
    
    } 

    function stopAudio() {

        var stream = streamState;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.stop();
        }

        setStreamState(null);
        setMediaRecorderState(null);
        
    }
    
    function startAudio(){
        
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        
            setStreamState(stream);
            const mediaRecorder = new MediaRecorder(stream);
            setMediaRecorderState(mediaRecorder);
            mediaRecorder.start(50);
            var chunks = [];

            setTimeout(() => {
                mediaRecorder.stop();
            }, 500);

            mediaRecorder.addEventListener("stop", () => {

                console.log("working?");
                const audioBlob = new Blob(chunks);
                const audioUrl = URL.createObjectURL(audioBlob);

                context.socket.emit("audio", audioUrl);
                chunks = [];

                if(!microphone){

                    mediaRecorder.start();
                    
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 500);

                }

            });

            mediaRecorder.addEventListener("dataavailable", e => {
                console.log("pushing!");
                chunks.push(e.data);
            });

        });

        
        
    }

    async function setAudio(){
        
        if(microphone){
            await setMicrophone(false);
            stopAudio();
        }else{
            await setMicrophone(true);
            startAudio();
        }
    }

}


