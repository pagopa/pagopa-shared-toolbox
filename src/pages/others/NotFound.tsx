import React from "react";
import { Alert } from "react-bootstrap";

const NotFound: React.FC = () => (
  <Alert className={"col-md-12"} color={"red"}>
    Oops! The page did not exists!
  </Alert>
);

export default NotFound;
