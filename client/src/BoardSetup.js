import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';



function BoardSetup() {
  
  const navigate  = useNavigate();
  let params = useParams();

  // minimum 2, maximum 10
  const [rowNum, setRowNum] = React.useState(5);
  const [colNum, setColNum] = React.useState(5);
  const [isAI, setIsAI] = React.useState(false);


  React.useEffect(() => {
    if (params.isAI === "PVAI"){
      setIsAI(true);
    }
  });

  const onRowNumChange = (e) =>{
    if (e.target.value === "" || (e.target.value >= 2 && e.target.value <= 10)){
      setRowNum(Number(e.target.value));
    }
  };
  const onColNumChange = (e) =>{
    if (e.target.value === "" || (e.target.value >= 2 && e.target.value <= 10)){
      setColNum(Number(e.target.value));
    }
  };
  const handleSubmit = () =>{
    navigate('/GamePlay', {
      state: {
        rowNum: rowNum,
        colNum: colNum,
        isAI: isAI,
      }
    });
  };

  

  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div >

      
      <form onSubmit={() =>handleSubmit()} 
        style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column",
        padding:"20px",
      }} >
        <label>
          {"Board Row Number(2 to 10): "}
          <textarea value={rowNum} onChange={(e)=>onRowNumChange(e)} />
        </label>
        <label>
          {"Board Column Number(2 to 10): "}
          <textarea value={colNum} onChange={(e)=>onColNumChange(e)} />
        </label>
        <input className="setupPageButton" type="submit" value="Start" />
      </form>

      

    </div>
  );
}

export default BoardSetup;
