import React, { useState, useEffect } from "react";
import { User } from "../interfaces";
import Image from "next/image";
import styles from "@/styles/Contact.module.css";

interface ContactsProps {
  contacts: any;
  currentUser: any;
  changeChat: (chat: any) => void;
}
const Contacts: React.FC<ContactsProps> = ({
  contacts,
  currentUser,
  changeChat,
}) => {
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserImage, setCurrentUserImage] = useState<string>("");
  const [currentSelected, setCurrentSelected] = useState<string>("");
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    const setUser = async () => {
      if (localStorage.getItem("user")) {
        const data: User = await JSON.parse(localStorage.getItem("user")!);
        setCurrentUserName(data.username);
        // setCurrentUserImage(data.avatarImage);
      }
    };
    setUser();
  }, []);

  const changeCurrentChat = (index: any, contact: any) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleEditButton = () => {};

  return (
    <>
      <main className={styles.main}>
        <div className={styles.brand}>
          <Image src="/chat.png" alt="logo" height={48} width={48} priority />
          <h3>Chat</h3>
        </div>
        <div className={styles.contacts}>
          {contacts?.map((contact: any, index: any) => {
            return (
              <div
                key={contact.id}
                className={`${styles.contact} ${
                  index === currentSelected ? styles.selected : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className={styles.avatar}>
                  <Image
                    className={styles.image}
                    src="/DefaultAvatar.png"
                    alt=""
                    height={48}
                    width={48}
                    priority
                  />
                </div>
                <div className={styles.username}>
                  <h2>{contact.username}</h2>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.currentUser}>
          <div
            className={styles.avatar}
            onMouseEnter={() => setShowEditButton(true)}
            onMouseLeave={() => setShowEditButton(false)}
          >
            <Image
              className={styles.image}
              src="/DefaultAvatar.png"
              alt="avatar"
              height={50}
              width={50}
              priority
            />

            {showEditButton && (
              <div className={styles.cameraImg} onClick={handleEditButton}>
                <Image
                  className={styles.image}
                  src="/camera.png"
                  alt="camera"
                  height={50}
                  width={50}
                  priority
                />
              </div>
            )}
          </div>
          <div className={styles.username}>
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contacts;
