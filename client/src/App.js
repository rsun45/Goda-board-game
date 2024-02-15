import logo from './logo.svg';
import './App.css';
import React from "react";
import { Link, Routes, Route, Navigate  } from 'react-router-dom';
import Cy_example from './CyExample';
import HomePage from './HomePage';

function sayHello() {
  alert('You clicked me!');
}


const Home = () => <h1>Home</h1>;
const About = () => <h1>About</h1>;

function App() {

  

  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div>

      <Routes>
        <Route path="/"  element={<HomePage />} />
        <Route path="/VSAI"  element={<Cy_example />} />
        <Route path="/about"  component={About} />
      </Routes>
    </div>
  );
}

export default App;
