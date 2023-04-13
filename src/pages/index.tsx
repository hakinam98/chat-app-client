import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import Welcome from "./components/Welcome";
import { User } from "./interfaces";
import Contacts from "./components/Contact";
import { getAllUsers, host } from "./api";
import { useRouter } from "next/router";
import ChatContainer from "./components/ChatContainer";
import { Socket, io } from "socket.io-client";
import dynamic from "next/dynamic";

const DynamicVideoCall = dynamic(() => import("./components/VideoCall"), {
  ssr: false,
});
const DynamicPeer = dynamic(() => import("./components/ConnectPeer"), {
  ssr: false,
});

export default function Home() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [accessToken, setAccessToken] = useState(undefined);
  const [isCall, setCall] = useState(false);
  const router = useRouter();
  const socket = useRef<Socket>();

  useEffect(() => {
    const setUser = async () => {
      if (!localStorage.getItem("user")) {
        router.replace("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("user")!));
      }
    };
    setUser();
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      socket.current! = io(`${host}?user_id=${currentUser.id}`, {
        transports: ["websocket"],
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const setToken = async () => {
      if (!localStorage.getItem("accessToken")) {
        localStorage.removeItem("user");
        router.replace("/login");
      } else {
        setAccessToken(await JSON.parse(localStorage.getItem("accessToken")!));
      }
    };
    setToken();
  }, [router]);

  useEffect(() => {
    const getContacts = async () => {
      if (currentUser && accessToken) {
        const { data } = await getAllUsers(currentUser.id, accessToken);
        setContacts(data);
      } else {
        // navigate("/setAvatar");
      }
    };
    getContacts();
  }, [currentUser, accessToken]);

  const handleChatChange = (chat: any) => {
    setCurrentChat(chat);
  };

  // useEffect(() => {
  //   const peer = new Peer({
  //     host: "localhost",
  //     port: 9000,
  //     path: "/myapp",
  //   });

  //   peer.on("open", (id) => {
  //     socket.current.emit("peer-id", {
  //       peer_id: id,
  //       user_id: currentUser?.id,
  //     });
  //   });
  // });
  // useEffect(() => {
  //   socket.current?.on("calling", (data: any) => {
  // console.log(data);
  //   });
  // });
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <DynamicPeer socket={socket.current} />
        <div className={!isCall ? styles.container : styles.containerCall}>
          {!isCall ? (
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChatChange}
            />
          ) : (
            <DynamicVideoCall
              currentChat={currentChat}
              currentUser={currentUser}
              accessToken={accessToken}
              socket={socket}
              isCall={isCall}
              setCall={setCall}
            />
          )}
          {currentChat === undefined ? (
            <Welcome currentUsername={currentUser?.username || ""} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              accessToken={accessToken}
              socket={socket}
              setCall={setCall}
            />
          )}
        </div>
      </main>
    </>
  );
}
