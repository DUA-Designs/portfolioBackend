const express=require('express');
const  {MongoClient,ServerApiVersion }=require('mongodb');
const cors=require('cors');
 
require('dotenv').config();

const uri = process.env.DB_URI;

const app=express();
const corsOptions={
    origin:'*',
    methods:'*',
    allowedHeaders:'*'
}
app.use(cors(corsOptions));
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    catch(err){console.dir(err);}
  }
  run();
  const dbName='myClients';
  const collectionName='Clients';
  const database=client.db(dbName);
  const collection=database.collection(collectionName);
  const options={projection:{_id:0}};





app.get('/sendData',cors(),async (req,res)=>{
  const {userName,userEmail}=req.query;
  
    
   
   if(userName && userEmail  ){
    try {
      const cursor= collection.find({ $or: [ { userName: userName }, { userEmail: userEmail }] },options);
      let check=true;
      for await(let doc of cursor){
        console.log(doc);
           if(userName===doc.userName || userEmail===doc.userEmail  ){
            check=false;
            break;
           }
      }
      if(check){
        const response=await collection.insertOne( {userName,userEmail } );
        if(response.acknowledged){
          res.send("We have acknowledged your message.");
        }

      }
      else{
        res.send("Data already exist.");
      }
   } catch (e) {
            console.log(e);
   };
   }
   else{
   
    res.send("No user data received");
   }
  

    
});
 
 


app.listen(5000,()=>{
    console.log("Server is running");
})