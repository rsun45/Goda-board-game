


// check if an edge is added already
function check2DArrInclude(twoDArr, arr) {
    let result = false;
    for (let  i = 0; i < twoDArr.length; i++){
      if (twoDArr[i][0] == arr[0] && twoDArr[i][1] == arr[1]){
        result = true;
      }
    }
    return result;
}

// input game board row and collumn numbers, return an array stored all possible edges(include two ways for each edge)
function getAllEdges(rowNum, colNum) {
    let edges = [];
    for (let i = 0; i < rowNum; i++){
        for (let j = 0; j < colNum; j++){
            let nextCol = j + 1;
            if (nextCol < colNum){
                edges.push([''+i+','+j, ''+i+','+nextCol]);
                edges.push([''+i+','+nextCol, ''+i+','+j]);
            }
            let nextRow = i + 1;
            if (nextRow < rowNum){
                edges.push([''+i+','+j, ''+nextRow+','+j]);
                edges.push([''+nextRow+','+j, ''+i+','+j]);
            }

        }
    }
    return edges;
}


// get all possible edges, on way for all edges
 function getAllPossibleEdges(rowNum, colNum, addedEdges) {
    let edges = [];
    for (let i = 0; i < rowNum; i++){
        for (let j = 0; j < colNum; j++){
            let nextCol = j + 1;
            if (nextCol < colNum){
                if (!check2DArrInclude(addedEdges, [''+i+','+j, ''+i+','+nextCol])){
                    edges.push([''+i+','+j, ''+i+','+nextCol]);
                }
            }
            let nextRow = i + 1;
            if (nextRow < rowNum){
                if (!check2DArrInclude(addedEdges, [''+i+','+j, ''+nextRow+','+j])){
                    edges.push([''+i+','+j, ''+nextRow+','+j]);
                }
            }

        }
    }
    return edges;
}

// function to shuffle and array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
// get all possible edges in random order, on way for all edges
function getAllPossibleEdgesRandomly(rowNum, colNum, addedEdges) {
    let edges = [];
    for (let i = 0; i < rowNum; i++){
        for (let j = 0; j < colNum; j++){
            let nextCol = j + 1;
            if (nextCol < colNum){
                if (!check2DArrInclude(addedEdges, [''+i+','+j, ''+i+','+nextCol])){
                    edges.push([''+i+','+j, ''+i+','+nextCol]);
                }
            }
            let nextRow = i + 1;
            if (nextRow < rowNum){
                if (!check2DArrInclude(addedEdges, [''+i+','+j, ''+nextRow+','+j])){
                    edges.push([''+i+','+j, ''+nextRow+','+j]);
                }
            }

        }
    }
    return shuffle(edges);
}


// function to check if add the edge can make bound, and return 0 - no bound is made, 1 - 1 bound will be made, 2 - 2 bound will be made
// sn - source node; tn - target node; addedEdges - existing edges; rowNum, colNum - row and column numbers
function ifTheEdgeMakeBound(sn, tn, addedEdges, rowNum, colNum) {
    let result = 0;
    const snArr = [ parseInt(sn.split(',')[0]), parseInt(sn.split(',')[1]) ];
    const tnArr = [ parseInt(tn.split(',')[0]), parseInt(tn.split(',')[1]) ];

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
        if (n1x >= 0 && check2DArrInclude(addedEdges, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(addedEdges, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(addedEdges, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
            result = result + 1;
        }
        n1x = snArr[0]+1;
        n1y = snArr[1];
        n2x = tnArr[0]+1;
        n2y = tnArr[1];
        if (n1x < colNum && check2DArrInclude(addedEdges, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(addedEdges, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(addedEdges, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
            result = result + 1;
        }
    }
    // upper lower nodes
    else {
        n1x = snArr[0];
        n1y = snArr[1]-1;
        n2x = tnArr[0];
        n2y = tnArr[1]-1;
        if (n1y >= 0 && check2DArrInclude(addedEdges, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(addedEdges, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(addedEdges, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
            result = result + 1;
        }
        n1x = snArr[0];
        n1y = snArr[1]+1;
        n2x = tnArr[0];
        n2y = tnArr[1]+1;
        if (n1y < rowNum && check2DArrInclude(addedEdges, [''+snArr[0]+','+snArr[1], ''+n1x+','+n1y]) && check2DArrInclude(addedEdges, [''+tnArr[0]+','+tnArr[1], ''+n2x+','+n2y])  && check2DArrInclude(addedEdges, [''+n1x+','+n1y, ''+n2x+','+n2y])) {
            result = result + 1;
        }

    }
    return result;
}


// find the maximun adding bound move
// return object for storing bounds number, edge to add and duplicated edge to ignore checking
function recursionFindEdgeForBound(rowNum, colNum, addedEdges) {
    console.log('recursion start >>>>');
    let result = 0;
    let resultNext = 0;
    let edge = [];
    let edgeNext = [];
    let ignoreEdges = [];
    let returnValue;

    const possibleEdges = getAllPossibleEdges(rowNum, colNum, addedEdges);

    if (possibleEdges.length === 0){
        console.log('<<<< no possible edge, recursion end');
        return {result, edge, ignoreEdges};
    }
    
    for (let i = 0; i < possibleEdges.length; i++){
        console.log('ignoreEdges: ', ignoreEdges);
        console.log('possibleEdges: ', possibleEdges[i]);
        if (!check2DArrInclude(ignoreEdges, possibleEdges[i])){

            const boundsNum = ifTheEdgeMakeBound(possibleEdges[i][0], possibleEdges[i][1], addedEdges, rowNum, colNum);
            
            // console.log('recursion checking edge: ' + [possibleEdges[i][0], possibleEdges[i][1]]);
            // console.log('boundsNum: ' + boundsNum);

            if (boundsNum !== 0){
                addedEdges.push(possibleEdges[i], [possibleEdges[i][1], possibleEdges[i][0]]);
                console.log('going to next recursion----->');
                returnValue = recursionFindEdgeForBound(rowNum, colNum, addedEdges);
                if (returnValue.result !== 0){
                    resultNext = returnValue.result + boundsNum;
                    ignoreEdges = ignoreEdges.concat(returnValue.ignoreEdges);
                }
                else {
                    resultNext = boundsNum;
                }
                ignoreEdges.push(possibleEdges[i], [possibleEdges[i][1], possibleEdges[i][0]]);
                edgeNext = possibleEdges[i];
                addedEdges.pop();
                addedEdges.pop();
            }
            // console.log('result: ' + result);
            // console.log('resultNext: ' + resultNext);
            
            if (result === 0 || result < resultNext){
                result = resultNext;
                edge = edgeNext;
            }
            // if (result === 0 && resultNext!== 0){
            //     result = [];
            //     result.concat(resultNext);
            // }
            // else if (result !== 0 && resultNext!== 0 && result[0] < resultNext[0]){
            //     result = [];
            //     result.concat(resultNext);
            // }
        }
        else {
            console.log('save recurtion time!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        }
    }
    // console.log('return result: ' + result);
    console.log('<<<< recursion end');
    return {result, edge, ignoreEdges};
}


 function aiNormal(rowNum, colNum, addedEdges) {
    const result = recursionFindEdgeForBound(rowNum, colNum, addedEdges);
    if (result.result !== 0){
        return result.edge;
    }
    else {
        let result2;
        let result3;
        let returnEdge;
        const possibleEdges = getAllPossibleEdgesRandomly(rowNum, colNum, addedEdges);
        for (let i = 0; i < possibleEdges.length; i++){
            addedEdges.push(possibleEdges[i], [possibleEdges[i][1], possibleEdges[i][0]]);
            console.log('newAddedEdges: ' + addedEdges);
            result3 = recursionFindEdgeForBound(rowNum, colNum, addedEdges);
            console.log('result is: ' + result3);
            if (result3.result === 0) {
                return possibleEdges[i];
            }
            else if (result2 === undefined || result2.result > result3.result){
                result2 = result3;
                returnEdge = possibleEdges[i];
            }
            addedEdges.pop();
            addedEdges.pop();
        }
        return returnEdge;
    }
}



module.exports = {
    // input game board row and collumn numbers, and added edges, return an array of all avaliable edges
    getAllPossibleEdges : getAllPossibleEdges,

    // input game board row and collumn numbers, and added edges, return an array of all avaliable edges
    aiNormal : aiNormal,
  

};
