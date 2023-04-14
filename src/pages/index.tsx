import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { host } from "./api";
import { User } from "./interfaces";

const DynamicHome = dynamic(() => import("./components/Home"), {
  ssr: false,
});

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User>();
  const [accessToken, setAccessToken] = useState(undefined);
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
    if (currentUser) {
      socket.current! = io(`${host}?user_id=${currentUser.id}`, {
        transports: ["websocket"],
      });
    }
  }, [currentUser]);

  return (
    <>
      <DynamicHome
        currentUser={currentUser}
        accessToken={accessToken}
        socket={socket}
      />
    </>
  );
}
