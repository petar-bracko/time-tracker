import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUserStore } from "../zustand/store";
import { useSpinner } from "../hooks";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

type LoginData = {
  username: string;
  password: string;
};

export const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const authUser = useUserStore((state) => state.authUser);
  const navigate = useNavigate();
  const { endSpin, spinning, startSpin } = useSpinner();
  const user = useUserStore((state) => state.user);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loginData.username.length || !loginData.password.length) {
      setLoginError("Please enter username and password.");
      return;
    }
    setLoginError("");
    const usersQuery = query(
      collection(db, "users"),
      where("username", "==", loginData.username)
    );
    startSpin();
    try {
      const usersSnapshot = await getDocs(usersQuery);
      if (!usersSnapshot.docs.length) {
        setLoginError("No user found.");
        return;
      }
      const user = usersSnapshot.docs[0].data();
      const userId = usersSnapshot.docs[0].id;
      if (user.password === loginData.password) {
        authUser(user.username, userId);
        navigate("/", { replace: true });
      } else {
        setLoginError("Wrong password.");
      }
    } catch {
      console.error("Error while fetching users");
    } finally {
      endSpin();
    }
  }

  useEffect(() => {
    if (user.isAuthenitacted) navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Login</h2>
      <div className="form-wrapper">
        <form onSubmit={handleLogin} className="login-form">
          <InputText
            placeholder="Username"
            value={loginData.username}
            onInput={({ currentTarget: { value } }) =>
              setLoginData({ ...loginData, username: value })
            }
          />
          <Password
            placeholder="Password"
            feedback={false}
            toggleMask
            value={loginData.password}
            onInput={({ currentTarget: { value } }) =>
              setLoginData({ ...loginData, password: value })
            }
          />
          {loginError.length > 0 && <p className="login-error">{loginError}</p>}
          {spinning ? (
            <ProgressSpinner />
          ) : (
            <Button className="submit-login-btn">Login</Button>
          )}
        </form>
      </div>
    </div>
  );
};
