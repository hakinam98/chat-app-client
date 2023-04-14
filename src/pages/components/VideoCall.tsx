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
  myVideoRef: any;
  peerVideoRef: any;
}

const VideoCall: React.FC<VideoCallProps> = ({
  currentChat,
  socket,
  currentUser,
  setCall,
  isCall,
  myVideoRef,
  peerVideoRef,
}) => {
  const [errorSetting, seterrorSetting] = useState("");

  // const myStreamRef = useRef(null); //Our video stream
  const [done, setdone] = useState(false);
  // const [currentUser, setCurrentUser] = useState<User>();
  const [isVideo, setVideo] = useState(true);
  const [isMic, setMic] = useState(true);

  console.log("myVideo", myVideoRef);

  console.log("peer", peerVideoRef);

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
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
