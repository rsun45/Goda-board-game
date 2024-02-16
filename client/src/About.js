import React from "react";
import { useNavigate   } from 'react-router-dom';
import './App.css';



function About() {

  
  const navigate  = useNavigate();

  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div style={{margin: "20px"}}>
      
      <h2>
        Game Instruction 
      </h2>

      <br/>
      
      <h3>
        Game Board 
      </h3>
      <p>
        Game board is a N * N dots matrix, the distance between the two nearest dots are 1 unit, e.g. one dot is 1 unit far from its top, right, bottom or left dot.
      </p>

      <h3>
        Game Play 
      </h3>
      <p>
        There are two players(Blue & Red) move on the board alternately, blue first. 
      </p>
      <p>
        When doing movement, player can only draw a line between two dots which are 1 unit distance from each other. 
      </p>
      <p>
        When the drawing achieve 1 * 1 closed square(s), the square(s) will be occupied by the current player, and the player have a extra turn for drawing line.
      </p>
      
      <h3>
        Game Goal 
      </h3>
      <p>
        When no player can make a draw, system will count players' occupied squares, the player with more squares wins.
      </p>

      <button className="aboutPageButton" onClick={() => navigate("/")}>Go back</button>

    </div>
  );
}

export default About;
