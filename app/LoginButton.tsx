"use client";

// UI
import Button from "./Button";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

const LoginButton = function () {
  const ethersContext = useContext(EthersContext);
  const onClick = () => {
    ethersContext.connectUniversalProfile();
  };

  return <Button onClick={onClick}>Login with Universal Profile</Button>;
};

export default LoginButton;
