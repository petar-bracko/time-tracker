import { Navigate } from "react-router-dom";
import { useUserStore } from "../zustand/store";

interface Props {
  children: React.ReactNode;
}

export const RouteGuard = ({ children }: Props) => {
  const user = useUserStore((state) => state.user);

  return user.isAuthenitacted ? <>{children}</> : <Navigate to="/login" />;
};
