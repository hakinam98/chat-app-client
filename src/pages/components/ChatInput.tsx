import React, { useEffect, useRef, useState } from "react";
import Picker, { EmojiClickData, Theme } from "emoji-picker-react";
import { BsEmojiSmileFill, BsCameraVideoFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import Image from "next/image";
import styles from "@/styles/ChatInput.module.css";
import { Peer } from "peerjs";
import { User } from "../interfaces";

interface ChatInputProps {
  currentChatId: number;
  handleSendMessage: (msg: string, img: string) => {};
  socket: any;
  setCall: any;
  currentUser: User | undefined;
  peerInstance: any;
  // setMyVideoRef: any;
  myVideoRef: any;
}

const ChatInput: React.FC<ChatInputProps> = ({
  handleSendMessage,
  currentChatId,
  setCall,
  socket,
  currentUser,
  peerInstance,
  // setMyVideoRef,
  myVideoRef,
}) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images] = React.useState([]);
  const [peerId, setPeerId] = useState<string>("");
  // const myVideoRef = useRef(); //Your video
  const peerVideoRef = useRef(); //The other users video

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event: any) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMessage(msg, "");
      setMsg("");
    }
  };

  const onChange = (imageList: ImageListType) => {
    imageList.forEach((element: ImageType) => {
      if (element.dataURL) {
        handleSendMessage("", element.dataURL);
      }
    });
  };

  const handleError = (errors: any, _: any) => {
    console.log(errors);
  };

  const handleCall = () => {
    setCall(true);
    console.log("Call");

    socket.current.emit("call-to", {
      from: currentUser?.id,
      to: currentChatId,
    });
    socket.current.emit("get-peer-id", currentChatId);
    socket.current.on("rec-peer-id", (peerId: string) => {
      setPeerId(peerId);
    });

    var getUserMedia = navigator.mediaDevices.getUserMedia;
    getUserMedia({
      video: true,
      audio: true,
    }).then((mediaStream) => {
      // setMyVideoRef(...current, mediaStream);
      myVideoRef.current = mediaStream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = mediaStream;
      }

      const call = peerInstance.current.call(peerId, mediaStream);

      call.on("stream", (peerStream: any) => {
        console.log(peerStream);
        peerVideoRef.current = peerStream;
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = peerStream;
        }
      });
    });
  };
  return (
    <main className={styles.main}>
      <div className={styles.buttonContainer}>
        <div className={styles.emoji}>
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className={styles.emojiPickerReact}>
              <Picker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
            </div>
          )}
        </div>
        <div className={styles.emoji1}>
          <BsCameraVideoFill onClick={() => handleCall()} />
        </div>
      </div>
      <form
        className={styles.inputContainer}
        onSubmit={(event) => sendChat(event)}
      >
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />

        <button type="submit">
          <IoMdSend />
        </button>
      </form>
      <div className={styles.imageSend}>
        <ImageUploading
          multiple={false}
          value={images}
          onChange={onChange}
          onError={handleError}
        >
          {({ onImageUpload, isDragging, dragProps }) => (
            <div>
              <button
                style={isDragging ? { color: "red" } : undefined}
                className={styles.addImageBtn}
                onClick={onImageUpload}
                {...dragProps}
              >
                <Image
                  className={styles.image}
                  src="/camera.png"
                  height={48}
                  width={48}
                  alt="camera"
                />
              </button>
            </div>
          )}
        </ImageUploading>
      </div>
    </main>
  );
};

export default ChatInput;
