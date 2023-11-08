"use client";

// UI
import Button from "./Button";

// Context
import { useContext } from "react";
import EthersContext from "@/context/EthersContext/EthersContext";

const SetPermissionsButton = function () {
  const { setPermissions } = useContext(EthersContext);

  return <Button onClick={setPermissions}>Set Permissions</Button>;
};

export default SetPermissionsButton;
