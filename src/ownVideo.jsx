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
                
                if (navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function (stream) {
                        video.srcObject = stream;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                }
                
            }else if(video.srcObject != undefined){
                stop(video);
                
                
            }
        }


        if(camera){

            if(interval === null){
    
                let int = window.setInterval(() => {
                                        
                    if(camera){
                        
                        context.socket.emit("video", captureFrame(video));
    
                    }
                
                }, 100);
            
                setInterval(int);
        
            }
    
        }else if(interval){
    
            clearInterval(interval);
            setInterval(null);
    
        }
            
    });
    

    return(

        <div className="video">
            
            <video width={"100%"} height={"100%"} autoPlay id="myVideo"></video>

        </div>

    )

    function stop(video) {

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

}