import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Predictor from "./components/Predictor";
import Ranking from "./components/Ranking";

function App() {
  const [vaccinationData, setVaccinationData] = useState([]);

  useEffect(() => {
    fetch("https://covid-express.herokuapp.com/api/vaccinations")
      .then((res) => res.json())
      .then((data) => {
        setVaccinationData(
          data.map((e: { [x: string]: string | number | Date }) => {
            e["date"] = new Date(e["date"]);
            return e;
          })
        );
      })
      .catch(console.log);
  }, []);

  if (vaccinationData !== undefined && vaccinationData.length > 0)
    return (
      <div>
        <Header />
        <div className="App">
          <body>
            <Predictor data={vaccinationData} />
            <Ranking data={vaccinationData} />
          </body>
        </div>
        <Footer />
      </div>
    );
  else {
    return (
      <body>
        <p>Loading...</p>
        {/* Do a spinning logo for loading screen */}
      </body>
    );
  }
}

export default App;
