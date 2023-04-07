import React, { useState } from "react";
import Picker, { EmojiClickData, Theme } from "emoji-picker-react";
import { BsEmojiSmileFill, BsCameraVideoFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import Image from "next/image";
import styles from "@/styles/ChatInput.module.css";
import Link from "next/link";

interface ChatInputProps {
  currentChatId: number;
  handleSendMessage: (msg: string, img: string) => {};
}

const ChatInput: React.FC<ChatInputProps> = ({
  handleSendMessage,
  currentChatId,
}) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images] = React.useState([]);
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
          <Link href={`/videocall?to=${currentChatId}`} target="_blank">
            <BsCameraVideoFill />
          </Link>
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
