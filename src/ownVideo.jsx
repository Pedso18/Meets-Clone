import { SocketContext } from "./webSocket"
import { useContext, useState, useEffect } from "react"



export default function OwnVideo(props){
    
    const context = useContext(SocketContext);
    const [camera, setCamera] = context.camera;
    const [video, setVideo] = useState(null);
    const [interval, setInterval] = useState(null);

    useEffect(() => {
    
        setVideo(document.querySelector("#myVideo"));
    
    }, []);

    useEffect(() => {

        if(video){

            if(camera === true){
                
                startVideo();
                
            }else if(video.srcObject != undefined){
                
                stop();
                
            }
        }

            
    });
    

    return(

        <div className="video">
            
            <video width={"100%"} height={"100%"} autoPlay id="myVideo"></video>

        </div>

    )

    function stop() {

        context.socket.emit("videoDeath");

        var stream = video.srcObject;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.stop();
        }
        
        video.srcObject = null;
    }

    function captureFrame(video) {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var canvasContext = canvas.getContext("2d");
        canvasContext.drawImage(video, 0, 0);
        return canvas.toDataURL('image/webp', 0.0000000000000000000000000000001);
    }
    
    function startVideo(){

        let mediaRecorderInterval = 50;
        let mediaRecorderDeathInterval = 400;
    
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

            video.srcObject = stream;
            
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start(mediaRecorderInterval);
            var chunks = [];
            
            setTimeout(() => {
                mediaRecorder.stop();
            }, mediaRecorderDeathInterval);
            
            mediaRecorder.addEventListener("stop", () => {
    
                console.log(chunks.length);
                const videoBlob = new Blob(chunks);
                const videoUrl = URL.createObjectURL(videoBlob);
                
                context.socket.emit("videoTest", videoUrl);
                chunks = [];
                
                if(camera && video.srcObject != undefined){
                    
                    mediaRecorder.start(mediaRecorderInterval);
                    
                    setTimeout(() => {
                        if(camera && video.srcObject != undefined){
                            
                            mediaRecorder.stop();

                        }
                    }, mediaRecorderDeathInterval);        
                    
                }
                
            });
            
            mediaRecorder.addEventListener("dataavailable", e => {
                console.log("pushing!");
                chunks.push(e.data);
            });
                
        });
        
    }
    
}



