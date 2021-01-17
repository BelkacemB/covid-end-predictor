import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Predictor from "./components/Predictor";

function App() {
  // TODO Load data here and pass it as props for the 2 components
  // Case for using useContext ?
  return (
    <div className="App">
      <header>
        <h1>Covid predictor</h1>
      </header>
      <body>
        <Predictor />
      </body>
    </div>
  );
}

export default App;
