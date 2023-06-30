import { collection, query, where, getDocs } from "firebase/firestore";
import { DB } from "../../config/firebase";
import type { LoginData } from "../../types";
import type { Spinner } from "../../hooks/useSpinner";
import type { NavigateFunction } from "react-router-dom";

export const loginUser = async (
  setLoginError: React.Dispatch<React.SetStateAction<string>>,
  loginData: LoginData,
  spinner: Spinner,
  authUser: (username: string, id: string) => void,
  navigate: NavigateFunction
) => {
  setLoginError("");
  const usersQuery = query(
    collection(DB, "users"),
    where("username", "==", loginData.username)
  );
  spinner.startSpin();
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
    spinner.endSpin();
  }
};
