const express = require('express');
const app =express();
const { MongoClient, ServerApiVersion, ObjectId,  } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res)=>{
    res.send('cake service server runing')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vxj4bij.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
      const cakedeliverycollection=  client.db('cakedelivery').collection('services');
      const cakeOrdercollection = client.db('cakedelivery').collection('orders');

      app.get('/services', async(req, res)=>{
         const query={};
         const cursor=  cakedeliverycollection.find(query);
         const result=await cursor.toArray()
         res.send(result)
        
      });

     app.get('/services/:id', async(req, res)=> {
          const id =req.params.id;
          const query={ _id: new  ObjectId(id) }
          const service=await cakedeliverycollection.findOne(query)
          res.send(service)
      });

        
     app.post('/orders', async(req, res)=>{
         const order =req.body;
         const result= await cakeOrdercollection.insertOne(order)
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