import React from "react";
import Navbar from "react-bootstrap/Navbar";
import LogoImg from '../img/logo-m.png'

export default function Header() {
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src={LogoImg}
          width="40"
          height="40"
          className="d-inline-block align-top"
        />{" "}
        Vaccine Race
      </Navbar.Brand>
    </Navbar>
  );
}
