import React, { Ref, useEffect, useRef, useState } from "react";
import Logout from "./Logout";
import { Message, User } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import styles from "@/styles/ChatContainer.module.css";
import ChatInput from "./ChatInput";
import dynamic from "next/dynamic";

interface ChatContainerProps {
  currentChat: any;
  currentUser: User | undefined;
  socket: any;
  accessToken: any;
  setCall: any;
  peerInstance: any;
  myVideoRef: any;
  // setMyVideoRef: any;
}

const DynamicChatInput = dynamic(() => import("./ChatInput"), { ssr: false });

const ChatContainer: React.FC<ChatContainerProps> = ({
  currentChat,
  currentUser,
  accessToken,
  socket,
  setCall,
  peerInstance,
  myVideoRef,
  // setMyVideoRef,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Message>();
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getMsg = async () => {
      if (currentChat && currentUser && accessToken) {
        // const response = await getAllMessages(currentUser.id, currentChat.id);
        // setMessages(response.data);
      }
      setIsLoading(false);
    };
    getMsg();
    //
  }, [currentChat, currentChat.id, currentUser]);

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("msg-recieve", (msg: string) => {
  //       setArrivalMessage({ fromSelf: false, message: msg });
  //       console.log(msg);
  //     });
  //   }
  // }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (msg: string, image: string) => {
    if (currentUser) {
      // await sendMessage(currentUser.id, currentChat._id, msg, image);
      // socket.current.emit("send-msg", {
      //   to: currentChat.id,
      //   from: currentUser?.id,
      //   message: msg,
      //   image,
      // });
    }

    setMessages((msgs) => [...msgs, { fromSelf: true, message: msg, image }]);
  };

  return (
    <main className={styles.main}>
      <div className={styles.chatHeader}>
        <div className={styles.userDetails}>
          <div className={styles.avatar}>
            <Image
              className={styles.image}
              height={48}
              width={48}
              src="/DefaultAvatar.png"
              alt="current Chat avatar"
            />
          </div>
          <div className={styles.username}>
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      {isLoading ? (
        <div className={styles.loadingMessages}>
          <Image
            height={48}
            width={48}
            src="/loader.gif"
            alt="loader"
            className="loader"
          />
        </div>
      ) : (
        <div className={styles.chatMessages}>
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`${styles.message} ${
                    message.fromSelf ? styles.sended : styles.recieved
                  }`}
                >
                  {message.message && (
                    <div className={styles.content}>
                      <p>{message.message}</p>
                    </div>
                  )}
                  {message.image && (
                    <div className={styles.contentImage}>
                      <Image
                        className={styles.image}
                        height={300}
                        width={350}
                        src={message.image}
                        alt="sended"
                        priority
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DynamicChatInput
        handleSendMessage={handleSendMessage}
        currentChatId={currentChat.id}
        socket={socket}
        setCall={setCall}
        currentUser={currentUser}
        peerInstance={peerInstance}
        // setMyVideoRef={setMyVideoRef}
        myVideoRef={myVideoRef}
      />
    </main>
  );
};

export default ChatContainer;
