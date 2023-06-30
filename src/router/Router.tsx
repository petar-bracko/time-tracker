import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Trackers, History, NotFound } from "../pages";
import { SharedLayout } from "../layout/SharedLayout";
import { RouteGuard } from "./RouteGuard";

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<SharedLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RouteGuard>
              <Trackers />
            </RouteGuard>
          }
        />
        <Route
          path="/history"
          element={
            <RouteGuard>
              <History />
            </RouteGuard>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
