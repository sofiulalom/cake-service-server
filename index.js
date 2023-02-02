const express = require('express');
const app =express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.get('/', (req, res)=>{
    res.send('cake service server runing')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vxj4bij.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
      const cakedeliverycollection=  client.db('cakedelivery').collection('services');
      app.get('/services', async(req, res)=>{
         const query={};
         const cursor=  cakedeliverycollection.find(query);
         const result=await cursor.toArray()
         res.send(result)
        
      })
    }
    finally{

    }
}
run().catch(e => console.error(e))


app.listen(port, ()=>{
  console.log(`cake service server runing port: ${port}`)
})