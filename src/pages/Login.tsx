import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/store";
import { useSpinner } from "../hooks";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import type { LoginData } from "../types";
import { loginUser } from "../helpers/utils";

export const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const authUser = useUserStore((state) => state.authUser);
  const navigate = useNavigate();
  const spinner = useSpinner();
  const user = useUserStore((state) => state.user);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loginData.username.length || !loginData.password.length) {
      setLoginError("Please enter username and password.");
      return;
    }
    loginUser(setLoginError, loginData, spinner, authUser, navigate);
  }

  useEffect(() => {
    if (user.isAuthenitacted) navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-wrapper">
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
          {spinner.spinning ? (
            <ProgressSpinner />
          ) : (
            <Button className="submit-login-btn">Login</Button>
          )}
        </form>
      </div>
    </div>
  );
};
