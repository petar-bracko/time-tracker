import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/store";
import { useModal, useSpinner } from "../hooks";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import type { LoginData, RegisterData } from "../types";
import { loginUser } from "../helpers/utils";
import { AiOutlineUser } from "react-icons/ai";
import { Dialog } from "primereact/dialog";
import { INIT_REGISTER_DATA, USERS_COLLECTION } from "../data/constants";
import { validateRegistration } from "../helpers/validation";
import { addDoc, doc, getDoc } from "firebase/firestore";
import { DB } from "../config/firebase";

const INIT_REGISTER_ERROR = { valid: false, msg: "" };

export const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const authUser = useUserStore((state) => state.authUser);
  const navigate = useNavigate();
  const loginSpinner = useSpinner();
  const registerSpinner = useSpinner();
  const user = useUserStore((state) => state.user);
  const registerModal = useModal();
  const [registrationData, setRegistrationData] =
    useState<RegisterData>(INIT_REGISTER_DATA);
  const [invalidRegistration, setInvalidRegistration] =
    useState(INIT_REGISTER_ERROR);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loginData.username.length || !loginData.password.length) {
      setLoginError("Please enter username and password.");
      return;
    }
    loginUser(setLoginError, loginData, loginSpinner, authUser, navigate);
  }

  async function handleRegistration() {
    registerSpinner.startSpin();
    setInvalidRegistration(INIT_REGISTER_ERROR);
    const isValid = validateRegistration(registrationData);
    if (isValid.valid) {
      try {
        const docRef = await addDoc(USERS_COLLECTION, {
          username: registrationData.username,
          password: registrationData.password,
        });
        const newUserId = docRef.id;
        const newUserRef = doc(DB, "users", newUserId);
        const newUserSnap = await getDoc(newUserRef);
        if (newUserSnap.exists()) {
          const newUserData = newUserSnap.data() as LoginData;
          loginUser(
            setLoginError,
            newUserData,
            registerSpinner,
            authUser,
            navigate
          );
        } else {
          console.error("Oops, no such document...");
        }
      } catch {
        console.error("Error while creating new user");
      } finally {
        registerSpinner.endSpin();
      }
      return;
    }
    registerSpinner.endSpin();
    setInvalidRegistration({ ...isValid });
  }

  const registerModalFooter = registerSpinner.spinning ? (
    <ProgressSpinner />
  ) : (
    <div>
      <Button
        label="Cancel"
        onClick={() => {
          registerModal.closeModal();
          setRegistrationData(INIT_REGISTER_DATA);
          setInvalidRegistration(INIT_REGISTER_ERROR);
        }}
        className="p-button-text"
      />
      <Button label="Yes" onClick={handleRegistration} />
    </div>
  );

  useEffect(() => {
    if (user.isAuthenitacted) navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-wrapper">
      <div className="form-wrapper">
        <h2 style={{ marginBottom: "3rem" }}>Login</h2>
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
          {loginSpinner.spinning ? (
            <ProgressSpinner />
          ) : (
            <Button className="submit-login-btn">Login</Button>
          )}
        </form>
      </div>
      <div className="register-wrapper">
        <div className="icon-wrapper">
          <AiOutlineUser />
        </div>
        <div className="register-info">
          <div style={{ fontSize: "1.5rem", color: "#5f6b8a" }}>
            Need an account?
          </div>
          <span className="register-link" onClick={registerModal.openModal}>
            Register here
          </span>
        </div>
      </div>
      <Dialog
        header="Registration"
        visible={registerModal.isModalVisible}
        onHide={() => {
          registerModal.closeModal();
          setRegistrationData(INIT_REGISTER_DATA);
          setInvalidRegistration(INIT_REGISTER_ERROR);
        }}
        footer={registerModalFooter}
        draggable={false}
      >
        <form className="registration-form">
          <InputText
            placeholder="Enter username"
            value={registrationData.username}
            onInput={({ currentTarget: { value } }) =>
              setRegistrationData({ ...registrationData, username: value })
            }
          />
          <Password
            toggleMask
            feedback={false}
            placeholder="Enter password"
            value={registrationData.password}
            onInput={({ currentTarget: { value } }) =>
              setRegistrationData({ ...registrationData, password: value })
            }
          />
          <Password
            toggleMask
            feedback={false}
            placeholder="Confirm password"
            value={registrationData.confirmPassword}
            onInput={({ currentTarget: { value } }) =>
              setRegistrationData({
                ...registrationData,
                confirmPassword: value,
              })
            }
          />
          {!invalidRegistration.valid && (
            <div className="register-error">{invalidRegistration.msg}</div>
          )}
        </form>
      </Dialog>
    </div>
  );
};
