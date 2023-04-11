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
  const myStreamRef = useRef(); //Our video stream
  const [done, setdone] = useState(false);
  // const [currentUser, setCurrentUser] = useState<User>();
  const [isVideo, setVideo] = useState(true);
  const [isMic, setMic] = useState(true);
  const [peerId, setPeerId] = useState<string>("");
  const router = useRouter();

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const peer = new Peer();
  useEffect(() => {
    peer.on("open", (id) => {
      socket.current.emit("peer-id", {
        peer_id: id,
        user_id: currentUser?.id,
      });
    });
  }, [peer]);

  useEffect(() => {
    if (isCall) {
      socket.current.emit("call-to", {
        from: currentUser?.id,
        to: currentChat.id,
      });
      socket.current.emit("get-peer-id", currentChat.id);
      socket.current.on("rec-peer-id", (peerId: string) => {
        setPeerId(peerId);
      });
    }
  }, [isCall]);

  useEffect(() => {
    //Getting our Video and Audio
    navigator.mediaDevices
      .getUserMedia({
        audio: isMic ? true : false,
        video: isVideo ? true : false,
      })
      .then((stream) => {
        myStreamRef.current = stream;
        myVideoRef.current.srcObject = stream;
        const call = peer.call(peerId, stream);
        call.on("stream", function (stream) {
          peerVideoRef.current.srcObject = stream;
          console.log("peerrrrrrrrr", peerVideoRef);
        });

        call.on("error", (err) => {
          alert(err);
        });
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  }, [peerId]);

  useEffect(() => {
    //Getting our Video and Audio
    navigator.mediaDevices
      .getUserMedia({
        audio: isMic ? true : false,
        video: isVideo ? true : false,
      })
      .then((stream) => {
        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", function (stream) {
            console.log(1);

            peerVideoRef.current.srcObject = stream;
            console.log("peerrrrrrrrr", peerVideoRef);
          });
        });
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.videoContainer}>
        <h2>{currentChat.username}</h2>
        <video
          autoPlay
          ref={peerVideoRef}
          playsInline
          width={"70%"}
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
                width={"250px"}
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
