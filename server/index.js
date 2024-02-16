// server/index.js
const AIPlayer = require('./AIPlayer');

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const bodyParser = require('body-parser')
app.set('port', (process.env.PORT || 8081))
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../client/build')));

/*
// mongo database connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://TonySun:63605966@management-database.4loo2bt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function runMongodb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
runMongodb().catch(console.dir);
*/



// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })


// input game board row and collumn numbers, and added edges,return a possible edge to add by beginning algorithm
function aiBeginner(rowNum, colNum, edges){
  let allPossibleEdges = AIPlayer.getAllPossibleEdges(rowNum, colNum, edges);
  return allPossibleEdges[Math.floor(Math.random() * allPossibleEdges.length)];
}
 

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// AI move - beginner
app.post('/api/ai-player/beginner', jsonParser, function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  const result = aiBeginner(req.body.rowNum, req.body.colNum, req.body.addedEdges);
  console.log('AI add edge: ' + result); 
  res.send(result);
});


// AI move - normal
app.post('/api/ai-player/normal', jsonParser, function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  const result = AIPlayer.aiNormal(req.body.rowNum, req.body.colNum, req.body.addedEdges);
  console.log('AI add edge: ' + result); 
  res.send(result);
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});




