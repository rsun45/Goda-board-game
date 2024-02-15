import React from "react";
import { Link } from 'react-router-dom';



function sayHello() {
  alert('You clicked me!');
}

function HomePage() {

  

  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div>

      <Link to="/">
        <button >Player VS Player</button>
      </Link>
      <Link to="/VSAI">
        <button>Player VS AI</button>
      </Link>
      <Link to="/about">
        <button >Game Instruction</button>
      </Link>

    </div>
  );
}

export default HomePage;
