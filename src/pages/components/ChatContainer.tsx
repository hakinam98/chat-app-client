import React, { Ref, useEffect, useRef, useState } from "react";
import Logout from "./Logout";
import { Message, User } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import styles from "@/styles/ChatContainer.module.css";
import dynamic from "next/dynamic";
import { BsFillTelephoneForwardFill } from "react-icons/bs";

interface ChatContainerProps {
  currentChat: any;
  currentUser: User | undefined;
  socket: any;
  accessToken: any;
  setCall: any;
  peerInstance: any;
  myVideoRef: any;
  peerVideoRef: any;
  handleAnswer: any;
  callRef: any;
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
  peerVideoRef,
  handleAnswer,
  callRef,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Message>();
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [peerId, setPeerId] = useState<string>("");

  const [isPeerInstanceReady, setIsPeerInstanceReady] = useState(false);

  useEffect(() => {
    if (peerInstance.current) {
      setIsPeerInstanceReady(true);
    }
  }, [peerInstance]);

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

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg: string) => {
        setArrivalMessage({ fromSelf: false, type: "message", message: msg });
        console.log(msg);
      });

      socket.current.on("rec-peer-id", (peerId: string) => {
        setPeerId(peerId);
      });

      socket.current.on("calling", (data: any) => {
        console.log(data);
        setArrivalMessage({
          fromSelf: false,
          type: "call",
          message: data.message,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (msg: string, image: string) => {
    if (currentUser) {
      // await sendMessage(currentUser.id, currentChat.id, msg, image);
      // socket.current.emit("send-msg", {
      //   to: currentChat.id,
      //   from: currentUser?.id,
      //   message: msg,
      //   image,
      // });
    }

    setMessages((msgs) => [
      ...msgs,
      { fromSelf: true, type: "message", message: msg, image },
    ]);
  };

  const handleClick = () => {
    setCall(true);
    console.log(callRef.current);

    if (callRef.current) {
      handleAnswer(callRef.current);
    }
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
                  {message.message &&
                    (message.type === "message" ? (
                      <div className={styles.content}>
                        <p>{message.message}</p>
                      </div>
                    ) : (
                      <div className={styles.content}>
                        <p>
                          {message.message}
                          <BsFillTelephoneForwardFill
                            onClick={() => handleClick()}
                          />
                        </p>
                      </div>
                    ))}

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
        myVideoRef={myVideoRef}
        peerVideoRef={peerVideoRef}
        peerId={peerId}
        setPeerId={setPeerId}
        accessToken={accessToken}
      />
    </main>
  );
};

export default ChatContainer;
