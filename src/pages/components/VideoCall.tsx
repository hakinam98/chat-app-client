import { FormEvent, useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastOptions } from "react-toastify/dist/types";
import Image from "next/image";
import styles from "@/styles/VideoCall.module.css";
import { useRouter } from "next/router";
import { User } from "../interfaces";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillTelephoneForwardFill,
  BsFillTelephoneXFill,
} from "react-icons/bs";
import { Peer } from "peerjs";

interface VideoCallProps {
  currentChat: any;
  currentUser: User | undefined;
  socket: any;
  accessToken: any;
  setCall: any;
  isCall: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({
  currentChat,
  socket,
  currentUser,
  setCall,
  isCall,
}) => {
  const [errorSetting, seterrorSetting] = useState("");
  const myVideoRef = useRef(); //Your video
  const peerVideoRef = useRef(); //The other users video
  // const myStreamRef = useRef(null); //Our video stream
  const [done, setdone] = useState(false);
  // const [currentUser, setCurrentUser] = useState<User>();
  const [isVideo, setVideo] = useState(true);
  const [isMic, setMic] = useState(true);
  const [peerId, setPeerId] = useState<string>("");
  const router = useRouter();
  const peerInstance = useRef();

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      socket.current.emit("peer-id", {
        peer_id: id,
        user_id: currentUser?.id,
      });
    });

    peer.on("call", (call) => {
      var getUserMedia = navigator.mediaDevices.getUserMedia;
      getUserMedia({
        video: isVideo ? true : false,
        audio: isMic ? true : false,
      }).then((mediaStream) => {
        // myVideoRef.current = mediaStream;
        myVideoRef.current.srcObject = mediaStream;
        // myVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", (peerStream) => {
          console.log(peerStream);
          peerVideoRef.current.srcObject = peerStream;
          // peerVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  // useEffect(() => {
  //   if (isCall) {
  //     socket.current.emit("call-to", {
  //       from: currentUser?.id,
  //       to: currentChat.id,
  //     });
  //     socket.current.emit("get-peer-id", currentChat.id);
  //     socket.current.on("rec-peer-id", (peerId: string) => {
  //       setPeerId(peerId);
  //     });
  //   }

  //   var getUserMedia = navigator.mediaDevices.getUserMedia;
  //   getUserMedia({
  //     video: isVideo ? true : false,
  //     audio: isMic ? true : false,
  //   }).then((mediaStream) => {
  //     // myVideoRef.current = mediaStream;
  //     myVideoRef.current.srcObject = mediaStream;
  //     // myVideoRef.current.play();

  //     const call = peerInstance.current.call(peerId, mediaStream);

  //     call.on("stream", (peerStream) => {
  //       peerVideoRef.current.srcObject = peerStream;
  //       // peerVideoRef.current.play();
  //     });
  //   });
  // }, [isCall]);

  const handleCall = () => {
    console.log("Call");

    socket.current.emit("call-to", {
      from: currentUser?.id,
      to: currentChat.id,
    });
    socket.current.emit("get-peer-id", currentChat.id);
    socket.current.on("rec-peer-id", (peerId: string) => {
      setPeerId(peerId);
    });

    var getUserMedia = navigator.mediaDevices.getUserMedia;
    getUserMedia({
      video: isVideo ? true : false,
      audio: isCall ? true : false,
    }).then((mediaStream) => {
      myVideoRef.current.srcObject = mediaStream;
      // myVideoRef.current.play();

      const call = peerInstance.current.call(peerId, mediaStream);

      call.on("stream", (peerStream) => {
        console.log(peerStream);

        peerVideoRef.current.srcObject = peerStream;
        // peerVideoRef.current.play();
      });
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.videoContainer}>
        <h2>{currentChat.username}</h2>
        <video
          autoPlay
          ref={peerVideoRef}
          // playsInline
          width={"100%"}
          // height={"100%"}
        />
        <div className={styles.videoContainerCurrent}>
          {isVideo ? (
            <div className={styles.video}>
              <video
                autoPlay
                ref={myVideoRef}
                muted
                playsInline
                width={"100px"}
              />
            </div>
          ) : (
            <div className={styles.image}>
              <Image
                className={styles.image}
                src="/DefaultAvatar.png"
                width={100}
                height={100}
                alt="avatar"
                priority
              />
              <h3>{currentUser?.username}</h3>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.emoji}>
          <BsFillTelephoneForwardFill
            className={styles.svg1}
            onClick={() => handleCall()}
          />
          <h5>Call/Answer</h5>
        </div>
        <div className={styles.emoji}>
          {isVideo === false ? (
            <BsCameraVideoOffFill
              className={styles.svg1}
              onClick={() => setVideo(true)}
            />
          ) : (
            <BsCameraVideoFill
              className={styles.svg1}
              onClick={() => setVideo(false)}
            />
          )}
          <h5>Camera</h5>
        </div>
        <div className={styles.emoji}>
          {isMic === false ? (
            <BsFillMicMuteFill
              className={styles.svg2}
              onClick={() => setMic(true)}
            />
          ) : (
            <BsFillMicFill
              className={styles.svg2}
              onClick={() => setMic(false)}
            />
          )}
          <h5>Camera</h5>
        </div>
        <div className={styles.emoji}>
          <BsFillTelephoneXFill className={styles.svg3} />
          <h5>Camera</h5>
        </div>
      </div>
    </main>
  );
};

export default VideoCall;
