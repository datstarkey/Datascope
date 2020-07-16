import React, { useContext } from "react";
import { AppContext } from "../Context/Context";
import { Button } from "antd";
import { LoginModal } from "./LoginModal";
import Cookies from "universal-cookie";

export const LoginDetails = () => {
  const context = useContext(AppContext);
  const cookies = new Cookies();
  const logout = () => {
    if (context.setAuthenticated) context.setAuthenticated(false);
    if (context.setBearer) context.setBearer("");
    cookies.remove("token");
  };
  return (
    <>
      {!context.authenticated ? (
        <LoginModal title="Login" />
      ) : (
        <Button style={{ float: "right", marginTop: "1rem" }} danger onClick={logout}>
          Logout
        </Button>
      )}
    </>
  );
};
