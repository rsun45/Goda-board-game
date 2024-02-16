import React from "react";
import { Link } from 'react-router-dom';
import './App.css';
import p1Img from './img/p1-blue.png';
import p2Img from './img/p2-red.png' 



function HomePage() {

  

  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: "column",
    }}>

      <div style={{
        display: 'flex',
        padding: "20px",
      }}>
        <img className="titleLeftImg" src={p1Img}/>
        <h1>GODA BOARD GAME</h1>
        <img className="titleRightImg" src={p2Img}/>
      </div>

      <Link to="/BoardSetup/PVP">
        <button className="homepageStyle">Player VS Player</button>
      </Link>
      <br />
      <Link to="/BoardSetup/PVAI">
        <button className="homepageStyle">Player VS AI</button>
      </Link>
      <br />
      <Link to="/About">
        <button className="homepageStyle">Game Instruction</button>
      </Link>

    </div>
  );
}

export default HomePage;
