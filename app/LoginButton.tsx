"use client";

// UI
import Button from "./Button";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

const LoginButton = function () {
  const { connectUniversalProfile } = useContext(EthersContext);

  return (
    <Button onClick={connectUniversalProfile}>
      Login with Universal Profile
    </Button>
  );
};

export default LoginButton;
