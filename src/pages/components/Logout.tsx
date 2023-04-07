import { useRouter } from "next/router";
import React from "react";
import { BiPowerOff } from "react-icons/bi";
import styles from "@/styles/Logout.module.css";

export default function Logout() {
  const router = useRouter();

  const handleClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.replace("/login");
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <BiPowerOff className={styles.svg} />
    </button>
  );
}
