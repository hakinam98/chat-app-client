import Image from "next/image";
import Logout from "./Logout";
import styles from "@/styles/Welcome.module.css";

interface WelcomeProps {
  currentUsername: string;
}

const Welcome: React.FC<WelcomeProps> = ({ currentUsername }) => {
  return (
    <main className={styles.main}>
      <div className={styles.logoutButton}>
        <Logout />
      </div>
      <Image
        className={styles.image}
        src="/hello.gif"
        alt="Dog saying Hi!"
        height={200}
        width={200}
        priority
      />
      <h1>
        Welcome, <span>{currentUsername}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </main>
  );
};

export default Welcome;
