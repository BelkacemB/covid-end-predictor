import React, { useState, useEffect } from "react";
import "./App.css";
import Predictor from "./components/Predictor";
import Ranking from "./components/Ranking";

function App() {
  const [vaccinationData, setVaccinationData] = useState([]); // TODO Move this to context

  useEffect(() => {
    fetch("https://covid-express.herokuapp.com/api/vaccinations")
      .then((res) => res.json())
      .then((data) => {
        setVaccinationData(data);
      })
      .catch(console.log);
  }, []);

  if (vaccinationData.length > 0)
    return (
      <div className="App">
        <body>
          <Predictor data={vaccinationData} />
          <Ranking data={vaccinationData} />
        </body>
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
