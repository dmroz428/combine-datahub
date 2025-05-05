import React, { useEffect, useState } from "react";
import vegaEmbed from "vega-embed";
import Chart from './Chart';
import './App.css';


const API_URL = "https://combine-datahub.onrender.com";
function App() {
  //const [message, setMessage] = useState("");
  const [position, setPosition] = useState('OT');
  const [test, setTest] = useState('Arm Length (in)');
  const [data, setData] = useState([]);
  

  const handlePos = (e) => {
    setPosition(e.target.value);
  };
  
  const handleTest = (e) => {
    setTest(e.target.value);
  };

  useEffect(() => {
    console.log("Updated data:", data);
  }, [data]);

  useEffect(() => {
    // fetch("http://localhost:5000/api/scatters")
    fetch(`${API_URL}/api/scatters`)
      .then((res) => res.json())
      .then((data) => {
        vegaEmbed("#vis", JSON.parse(data.message));
      });
      // fetch("http://localhost:5000/api/brush")
      fetch(`${API_URL}/api/brush`)
      .then((res) => res.json())
      .then((data) => {
        vegaEmbed("#vis2", JSON.parse(data.message));
      });
      // fetch("http://localhost:5000/api/dataload")
      fetch(`${API_URL}/api/dataload`)
      .then((res) => res.json())
      .then((res) => {
        // console.log("Response data:", res);
        // console.log("Parsed data:", res.message);
        
        setData(JSON.parse(res.message));
        // console.log("Set data:", data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className='flex'>
      <div>
        <h1 className='exo-2-title text'>NFL Combine Data Hub</h1>
        <div className='chartgroup'>
        <label htmlFor="position" className='exo-2-cap text'>Choose a position:</label>
          <select id="position" value={position} onChange={handlePos}>
            <option value="QB">Quarterback</option>
            <option value="RB">Running Back</option>
            <option value="WR">Wide Receiver</option>
            <option value="TE">Tight End</option>
            <option value="OT">Offensive Tackle</option>
            <option value="OG">Offensive Guard</option>
            <option value="S">Safety</option>
            <option value="EDGE">Edge Rusher</option>
            <option value="LB">Linebacker</option>
            <option value="DT">Defensive Tackle</option>
            <option value="CB">Cornerback</option>
          </select>
          <label htmlFor="test" className='exo-2-cap text'>Choose a test:</label>
          <select id="test"value={test} onChange={handleTest}>
            <option value="Height (in)">Height</option>
            <option value="Weight (lbs)">Weight</option>
            <option value="Hand Size (in)">Hand Size</option>
            <option value="Arm Length (in)">Arm Length</option>
            <option value="40 Yard">40 Yard</option>
            <option value="Bench Press">Bench Press</option>
            <option value="Vert Leap (in)">Vert Leap</option>
            <option value="Broad Jump (in)">Broad Jump</option>
            <option value="Shuttle">Shuttle</option>
            <option value="3Cone">3 Cone Drill</option>
          </select>
          <Chart data= {data} pos = {position} test={test}></Chart>
          <p className='exo-2-cap text'>Click on one of the bar charts to view players from that round.</p>
        </div>
        <div className='chartgroup'>
          <div id="vis"></div>
          <p className='exo-2-cap text'>Click on one of the points to view the players in that positiong group across all 3 charts.</p>
        </div>
        <div className='chartgroup'>
          <div id="vis2"></div>
          <p className='exo-2-cap text'>Select points on the scatter plot to see those points reflected on the bar chart</p>
        </div>
      </div>
    </div>
  );
}

export default App;

