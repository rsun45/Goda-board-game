import React from "react";
import {useEffect, useRef } from "react";
import { useState } from 'react';
import p1Img from './img/p1-blue.png';
import p2Img from './img/p2-red.png' 
import './board.css';
import './App.css';
import { useLocation } from "react-router-dom";
import { useNavigate   } from 'react-router-dom';
// import cytoscape from "cytoscape";
// import edgehandles from 'cytoscape-edgehandles';



// variable for checking repeated adding edge
let lastAddSN = '';
let lastAddTN = '';
let storeEdges = []; // ex: [['1,0', '0,0'],['0,0', '1,0'],['1,1', '1,2'],['1,2', '1,1']...]
let addedNodeIndex = 1;
let aiMoveCount = 1;
let globalP1Score = 0;
let globalP2Score = 0;
let currentPlayer = 1; // 1-first 2-second
let mapRowMax = 5;
let mapColMax = 5;
let isAI = true;



function getMap(row, col, mycy) {
  for (let  i = 0; i < row; i++){
    for (let  j = 0; j < col; j++){
      let idstr = i.toString() +','+ j.toString();
      mycy.add({
        group: 'nodes',
        data: { id: idstr },
        position: { x: j*100, y: i*100 }
      });
    }
  }
}

function check2DArrInclude(twoDArr, arr) {
  let result = false;
  for (let  i = 0; i < twoDArr.length; i++){
    if (twoDArr[i][0] === arr[0] && twoDArr[i][1] === arr[1]){
      result = true;
    }
  }
  return result;
}

// check if add bound when an edge is created
function checkAfterAddEdge(sn, tn, storeEdgesLocal, mapRowNum, mapColNum) {
  const snArr = [ parseInt(sn.split(',')[0]), parseInt(sn.split(',')[1]) ];
  const tnArr = [ parseInt(tn.split(',')[0]), parseInt(tn.split(',')[1]) ];

  let result = [];

  let n1x = 0;
  let n1y = 0;
  let n2x = 0;
  let n2y = 0;
  // left right nodes
  if (snArr[0] === tnArr[0]) {
    n1x = snArr[0]-1;
    n1y = snArr[1];
    n2x = tnArr[0]-1;
    n2y = tnArr[1];
    if (n1x >= 0 && check2DArrInclude(storeEdgesLocal, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(storeEdgesLocal, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(storeEdgesLocal, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
      result = result.concat([sn, tn, ''+n1x+','+n1y, ''+n2x+','+n2y]);
    }
    n1x = snArr[0]+1;
    n1y = snArr[1];
    n2x = tnArr[0]+1;
    n2y = tnArr[1];
    // console.log('n1x: ' + n1x);
    // console.log('n1y: ' + n1y);
    // console.log('n2x: ' + n2x);
    // console.log('n2y: ' + n2y);
    // console.log(n1x+' < '+mapColNum+' && '+'check2DArrInclude(storeEdgesLocal,'+[sn, ''+n1x+','+n1y]+') && '+'check2DArrInclude(storeEdgesLocal, '+[tn, ''+n2x+','+n2y]+')  && check2DArrInclude(storeEdgesLocal, '+[''+n1x+','+n1y, ''+n2x+','+n2y]+')');
    if (n1x < mapColNum && check2DArrInclude(storeEdgesLocal, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(storeEdgesLocal, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(storeEdgesLocal, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
      result = result.concat([sn, tn, ''+n1x+','+n1y, ''+n2x+','+n2y]);
    }
  }
  // upper lower nodes
  else {
    n1x = snArr[0];
    n1y = snArr[1]-1;
    n2x = tnArr[0];
    n2y = tnArr[1]-1;
    if (n1y >= 0 && check2DArrInclude(storeEdgesLocal, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(storeEdgesLocal, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(storeEdgesLocal, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
      result = result.concat([sn, tn, ''+n1x+','+n1y, ''+n2x+','+n2y]);
    }
    n1x = snArr[0];
    n1y = snArr[1]+1;
    n2x = tnArr[0];
    n2y = tnArr[1]+1;
    if (n1y < mapRowNum && check2DArrInclude(storeEdgesLocal, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(storeEdgesLocal, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(storeEdgesLocal, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
      result = result.concat([sn, tn, ''+n1x+','+n1y, ''+n2x+','+n2y]);
    }

  }
  return result;

}


// add parent bounding
function addBound(mycy, eh, player, node1, node2, node3, node4) {
  let pStr = 'parent node-' + node1.id() + '-' + node2.id() + '-' + node3.id() + '-' + node4.id();
  if (node1.isChild()){
    node1 = mycy.add({
      group: 'nodes',
      data: { id: node1.id() + ' plus ' + addedNodeIndex },
      position: node1.position(),
    });
    addedNodeIndex = addedNodeIndex + 1;
  }
  if (node2.isChild()){
    node2 = mycy.add({
      group: 'nodes',
      data: { id: node2.id() + ' plus ' + addedNodeIndex },
      position: node2.position(),
    });
    addedNodeIndex = addedNodeIndex + 1;
  }
  if (node3.isChild()){
    node3 = mycy.add({
      group: 'nodes',
      data: { id: node3.id() + ' plus ' + addedNodeIndex },
      position: node3.position(),
    });
    addedNodeIndex = addedNodeIndex + 1;
  }
  if (node4.isChild()){
    node4 = mycy.add({
      group: 'nodes',
      data: { id: node4.id() + ' plus ' + addedNodeIndex },
      position: node4.position(),
    });
    addedNodeIndex = addedNodeIndex + 1;
  }

  mycy.add({
    group: 'nodes',
    data: { id: pStr, playerNum:player },
  });
  node1.move({parent: pStr });
  node2.move({parent: pStr });
  node3.move({parent: pStr });
  node4.move({parent: pStr });

  mycy.getElementById(pStr).on('tapstart', function(evt){
    if (evt.target.id() === pStr){
      eh.disableDrawMode();
    }
  });
  mycy.getElementById(pStr).on('tapdragout', function(){
    eh.enableDrawMode();
  });
}


// function for changeing player
function changePlayer(setPlayer1Title, setPlayer2Title) {
  if (currentPlayer === 1){
    currentPlayer = 2;
    setPlayer1Title('hidden');
    setPlayer2Title('visible');
  }
  else {
    currentPlayer = 1;
    setPlayer2Title('hidden');
    setPlayer1Title('visible');
  }
}





// not working, write it in useEffect() 
// post array of all nodes and current edges to server and get next move made by algorithm
// function requestAImove(){
//   const requestOptions = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ rowNum: mapRowMax, colNum: mapColMax, addedEdges: storeEdges })
//   };
//   fetch('/api/ai-player/beginner', requestOptions)
//     .then((res) => res.json())
//     .then((data) => {console.log(data);return(data);});
// }


function CyExample() {

  const location = useLocation();
  const navigate  = useNavigate();

  mapRowMax = location.state.rowNum;
  mapColMax = location.state.colNum;
  isAI = location.state.isAI;


  // states for players scores
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  // function to increase player score
  const increaseP1 = (value) =>{
    setP1Score(p1Score + value);
  };
  const increaseP2 = (value) =>{
    setP2Score(p2Score + value);
  };

  
  // states for players display Name
  const [p1Name, setP1Name] = useState("Player 1 move");
  const [p2Name, setP2Name] = useState("Player 2 move");

  // change player title using use state
  const [player1Title, setPlayer1Title] = useState('visible');
  const [player2Title, setPlayer2Title] = useState('hidden');
  // state of Turn for AI moves
  // const [isAIMove, setIsAIMove] = useState(false);

  
  let cytoscape = require('cytoscape');
  let edgehandles = require('cytoscape-edgehandles');
  cytoscape.use( edgehandles ); // register extension

  const containerRef = useRef();


  useEffect(() => {
    // reset parameters
    lastAddSN = '';
    lastAddTN = '';
    storeEdges = []; 
    addedNodeIndex = 1;
    aiMoveCount = 1;
    currentPlayer = 1; 
    globalP1Score = 0;
    globalP2Score = 0;

    const config = {
      container: containerRef.current,
      style: [
        {
          selector: "node",
          // style: { content: "data(id)" },
          style: { content: "" },
        },
        {
          selector: ":parent",
          css: {
              "padding": "0px",
          }
        },
        { 
          
          selector: "[playerNum = 'p1']",
          style: {
            
            'background-image': p1Img,
            'border-opacity': '0',
            'background-opacity': '0',
            'background-width': '100px',
            'background-height': '100px',
            

          }
        },
        { 
          
          selector: "[playerNum = 'p2']",
          style: {
            
            'background-image': p2Img,
            'border-opacity': '0',
            'background-opacity': '0',  
            'background-width': '100px',
            'background-height': '100px',
            
          }
        },
      ],
      

      // elements: {
      //   nodes: [
      //     {
      //       data: { id: 'a' }
      //     },
    
      //     {
      //       data: { id: 'b' }
      //     },
          
      //     {
      //       data: { id: 'c' }
      //     },
          
      //     {
      //       data: { id: 'd' }
      //     },
      //   ],
      //   edges: [
      //     {
      //       data: { id: 'ab', source: 'a', target: 'b' }
      //     }
      //   ]
      // },
    
      // layout: {
      //   name: 'preset',
      //   padding: 100,
      // },

    };

    let mycy = cytoscape(config);

    // mycy.add({
    //   group: 'nodes',
    //   data: { weight: 75, id:'1' },
    //   // position: { x: 50, y: 50 }
    // });
    
    // mycy.add({
    //   group: 'nodes',
    //   data: { weight: 75, id:'2' },
    //   // position: { x: 100, y: 50 }
    // });
    
    
    // mycy.add({
    //   group: 'edges',
    //   data: { id: '12', source: '1', target: '2' },
    //   // position: { x: 600, y: 600 }
    // });

    getMap(mapRowMax,mapColMax,mycy);


    // mycy.layout({
    //   name: 'grid'
    // }).run();

  // mycy.autolock(true)


  let defaults = {
    canConnect: function( sourceNode, targetNode ){
      // whether an edge can be created between source and target
      // let result = !sourceNode.same(targetNode)
      let result = false;
      let snArr = [-1,-1];
      let tnArr = [-1,-1];
      if (sourceNode.length > 0){
        snArr = sourceNode[0].data().id.split(',');
      }
      if (targetNode.length > 0){
        tnArr = targetNode[0].data().id.split(',');
      }


      if (parseInt(snArr[0]) === parseInt(tnArr[0]) && (parseInt(snArr[1])+1 === parseInt(tnArr[1]) || parseInt(snArr[1])-1 === parseInt(tnArr[1]))){
        result = true;
      }
      else if (parseInt(snArr[1]) === parseInt(tnArr[1]) && (parseInt(snArr[0])+1 === parseInt(tnArr[0]) || parseInt(snArr[0])-1 === parseInt(tnArr[0]))){
        result = true;
      }
      
      return result; // e.g. disallow loops
    },
    edgeParams: function( sourceNode, targetNode ){
      // for edges between the specified source and target
      // return element object to be passed to cy.add() for edge
      // console.log(sourceNode[0].data().id)
      return {};
    },
    hoverDelay: 0, // time spent hovering over a target node before it is considered selected
    snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
    snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  };
  
  let eh = mycy.edgehandles( defaults );
  // eh.enable();
  eh.enableDrawMode();

  
  // let node1 = mycy.nodes('[id = "0,0"]');
  // let node2 = mycy.nodes('[id = "1,0"]');
  // let node3 = mycy.nodes('[id = "0,1"]');
  // let node4 = mycy.nodes('[id = "1,1"]');
  // // mycy.nodes()[1].style('background-color', 'red');
  // addBound(mycy, eh, 'p1', node1, node2, node3, node4);

  // node1 = mycy.nodes('[id = "2,0"]');
  // node3 = mycy.nodes('[id = "2,1"]');
  // addBound(mycy, eh, 'p2', node1, node2, node3, node4);


  // function for checking if the new added edges is legal, and if new bounds are available to add
  const checkLastEdgelegal = () => {

  }
  


  // function for AI moving and add edge
  const runAIMove = () => {
    // post array of all nodes and current edges to server and get next move made by algorithm
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowNum: mapRowMax, colNum: mapColMax, addedEdges: storeEdges })
    };
    fetch('/api/ai-player/normal', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log('AI select edge: ' + data);
        mycy.add({
          group: 'edges',
          data: { id: 'aiMove-'+aiMoveCount, source: data[0], target: data[1] },
        });
        storeEdges.push([data[0],data[1]]);
        storeEdges.push([data[1],data[0]]);
        lastAddTN = data[0];
        lastAddSN = data[1];
        
        console.log('AI add');
        console.log('source: ' + lastAddSN);
        console.log('target: ' + lastAddTN);
        console.log(storeEdges);
        let boundNodes = checkAfterAddEdge(lastAddSN, lastAddTN, storeEdges, mapRowMax, mapColMax);
        console.log(boundNodes); // nodes array for adding colored bound
        if (boundNodes.length / 4 === 1){
          if (currentPlayer === 1) {
            globalP1Score += 1;
            setP1Score(globalP1Score);
          }
          else {
            globalP2Score += 1;
            setP2Score(globalP2Score);
          }
          addBound(mycy, eh, 'p'+currentPlayer, mycy.getElementById(boundNodes[0]), mycy.getElementById(boundNodes[1]), mycy.getElementById(boundNodes[2]), mycy.getElementById(boundNodes[3]));
          aiMoveContainer();
        }
        else if (boundNodes.length / 4 === 2){
          if (currentPlayer === 1) {
            globalP1Score += 2;
            setP1Score(globalP1Score);
          }
          else {
            globalP2Score += 2;
            setP2Score(globalP2Score);
          }
          addBound(mycy, eh, 'p'+currentPlayer, mycy.getElementById(boundNodes[0]), mycy.getElementById(boundNodes[1]), mycy.getElementById(boundNodes[2]), mycy.getElementById(boundNodes[3]));
          addBound(mycy, eh, 'p'+currentPlayer, mycy.getElementById(boundNodes[4]), mycy.getElementById(boundNodes[5]), mycy.getElementById(boundNodes[6]), mycy.getElementById(boundNodes[7]));
          aiMoveContainer();
        }
        else {
          changePlayer(setPlayer1Title, setPlayer2Title);
        }     
        
        // condition of all edges are drawed, game over
        if (storeEdges.length/2 === ( mapRowMax*(mapColMax-1) + mapColMax*(mapRowMax-1) ) ){
          if (globalP1Score > globalP2Score){
            setP1Name("Winner!");
            setPlayer1Title('visible');
            setPlayer2Title('hidden');
          }
          else if (globalP1Score < globalP2Score){
            setP2Name("Winner!");
            setPlayer2Title('visible');
            setPlayer1Title('hidden');
          }
          else {
            setP1Name("Draw!");
            setP2Name("Draw!");
            setPlayer2Title('visible');
            setPlayer1Title('visible');
          }
        }

        aiMoveCount++;
      }) // get AI move here
      .catch((error) => {
        console.log('Error: Cannot get Ai move from server.');
        console.log(error);
      });

  };



  // function of ai move turn
  const aiMoveContainer = async () =>{
    console.log('in mycy add event');
    await new Promise(resolve => setTimeout(resolve, 500));
    runAIMove();
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // conditions of players adding new edges to board
  mycy.on('remove', 'edge', function(evt){

    console.log('in mycy remove event');

    let checkEdge = mycy.edges()[mycy.edges().length - 1]

    if (checkEdge && checkEdge.data().target.split(',').length === 2){
      if (checkEdge.data().target !== lastAddTN || checkEdge.data().source !== lastAddSN){
        
        lastAddTN = checkEdge.data().target;
        lastAddSN = checkEdge.data().source;


        if (!check2DArrInclude(storeEdges, [lastAddSN.split(' ')[0],lastAddTN.split(' ')[0]])){
          storeEdges.push([lastAddSN.split(' ')[0],lastAddTN.split(' ')[0]]);
          storeEdges.push([lastAddTN.split(' ')[0],lastAddSN.split(' ')[0]]);

          console.log('player add');
          console.log('source: ' + lastAddSN);
          console.log('target: ' + lastAddTN);
          console.log(storeEdges);

          let boundNodes = checkAfterAddEdge(lastAddSN, lastAddTN, storeEdges, mapRowMax, mapColMax);
          console.log(boundNodes); // nodes array for adding colored bound
          if (boundNodes.length / 4 === 1){
            if (currentPlayer === 1) {
              globalP1Score += 1;
              setP1Score(globalP1Score);
            }
            else {
              globalP2Score += 1;
              setP2Score(globalP2Score);
            }
            addBound(mycy, eh, 'p'+currentPlayer, mycy.getElementById(boundNodes[0]), mycy.getElementById(boundNodes[1]), mycy.getElementById(boundNodes[2]), mycy.getElementById(boundNodes[3]));
          }
          else if (boundNodes.length / 4 === 2){
            if (currentPlayer === 1) {
              globalP1Score += 2;
              setP1Score(globalP1Score);
            }
            else {
              globalP2Score += 2;
              setP2Score(globalP2Score);
            }
            addBound(mycy, eh, 'p'+currentPlayer, mycy.getElementById(boundNodes[0]), mycy.getElementById(boundNodes[1]), mycy.getElementById(boundNodes[2]), mycy.getElementById(boundNodes[3]));
            addBound(mycy, eh, 'p'+currentPlayer, mycy.getElementById(boundNodes[4]), mycy.getElementById(boundNodes[5]), mycy.getElementById(boundNodes[6]), mycy.getElementById(boundNodes[7]));
          }
          // else if (currentPlayer === 2 && isAI){
          //   mycy.add({
          //     group: 'edges',
          //     data: { id: 'aiMove-'+aiMoveCount, source: '0,0', target: '1,0' },
          //   });
          //   aiMoveCount++;
          //   mycy.emit('remove', []);
          // }
          else {
            if (isAI){
              changePlayer(setPlayer1Title, setPlayer2Title);
              aiMoveContainer();
            }
            else {
              changePlayer(setPlayer1Title, setPlayer2Title);
            }
          }

          // condition of all edges are drawed, game over
          if (storeEdges.length/2 === ( mapRowMax*(mapColMax-1) + mapColMax*(mapRowMax-1) ) ){
            if (globalP1Score > globalP2Score){
              setP1Name("Winner!");
              setPlayer1Title('visible');
              setPlayer2Title('hidden');
            }
            else if (globalP1Score < globalP2Score){
              setP2Name("Winner!");
              setPlayer2Title('visible');
              setPlayer1Title('hidden');
            }
            else {
              setP1Name("Draw!");
              setP2Name("Draw!");
              setPlayer2Title('visible');
              setPlayer1Title('visible');
            }
          }
          
        }
      }
      else {
        console.log( 'NA2' );
      }
    }
    else {
      console.log( 'NA1' );
    }

  });



  mycy.minZoom(0.5);
  mycy.maxZoom(2)
  mycy.zoom(1.4);
  mycy.center();
  // mycy.fit();
  


  }, []);

  return (
    <div>
      <div className ="gameTitle">
        <div className ="gameTitle1" style={{visibility: player1Title}}>
          <img src={p1Img}/>
          <h1>{p1Name}</h1>
        </div>
        <div>
          <h1>{p1Score} - {p2Score}</h1>
        </div>
        <div className ="gameTitle2" style={{visibility: player2Title}}>
          <img src={p2Img}/>
          <h1>{p2Name}</h1>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column",
      }}>
        <button className="gamePlayRestartButton" onClick={() => navigate("/")}>Restart</button>
      </ div>

      {/* <div ref={containerRef} style={{ height: '600px' }} id="cy"></div> */}
      <div ref={containerRef} id="cy"></div>
    </div>
  );
}

export default CyExample;