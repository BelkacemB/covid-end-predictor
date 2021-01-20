import React from "react";
import Navbar from "react-bootstrap/Navbar";

export default function Header() {
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src={require("../img/logo-m.png")}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        Vaccine Race
      </Navbar.Brand>
    </Navbar>
  );
}
