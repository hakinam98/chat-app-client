import { FormEvent, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastOptions } from "react-toastify/dist/types";
import { login } from "./api";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Login.module.css";
import Head from "next/head";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    console.log(values);

    event.preventDefault();
    if (handleValidation()) {
      const { password, email } = values;

      const { data } = await login({ password, email });
      console.log(data);

      //   if (data.error) {
      //     toast.error(data.message, toastOptions);
      //   } else {
      //     localStorage.setItem("chat-app-user", JSON.stringify(data.user));
      //     navigate("/");
      //   }
    }
  };

  const handleValidation = () => {
    const { password, email } = values;
    if (password === "") {
      toast.error("Username and password are required", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Username and password are required", toastOptions);
      return false;
    }
    return true;
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
          <div className={styles.brand}>
            <Image src="/chat.png" alt="logo" height={80} width={80} priority />
            <h1>chat</h1>
          </div>
          <input
            className={styles.input}
            type="text"
            placeholder="Email"
            name="email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />

          <button className={styles.button} type="submit">
            Login
          </button>
          <span className={styles.span}>
            Dont have an account? <Link href="/register">Register</Link>
          </span>
        </form>
        <ToastContainer />
      </main>
    </>
  );
}
