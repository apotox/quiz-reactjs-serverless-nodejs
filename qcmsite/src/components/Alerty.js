import React from "react";
import { useSelector } from "react-redux";
import { Alert } from "reactstrap";

function Alerty() {
  const { show, message } = useSelector((state) => state.alertReducer);

  if (!show) return <></>;

return <Alert color="primary">{message}</Alert>;
}

export default Alerty;
