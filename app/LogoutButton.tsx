"use client";

// UI
import Button from "./Button";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

const LogoutButton = function () {
  const { logout } = useContext(EthersContext);

  return <Button onClick={async () => logout()}>Logout</Button>;
};

export default LogoutButton;
