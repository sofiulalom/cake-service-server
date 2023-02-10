const express = require('express');
const app =express();
const { MongoClient, ServerApiVersion, ObjectId, OrderedBulkOperation,  } = require('mongodb');
require('dotenv').config();
const jwt=require('jsonwebtoken')
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
      // jwt api 
      app.post('/jwt', (req, res)=> {
          const user=req.body;
          const token= jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
          res.send({token})
      })
      // services api 
      app.get('/services', async(req, res)=>{
         const query={};
         const cursor=  cakedeliverycollection.find(query);
         const result=await cursor.toArray()
         res.send(result)
        
      });
       // services api id 
     app.get('/services/:id', async(req, res)=> {
          const id =req.params.id;
          const query={ _id: new  ObjectId(id) }
          const service=await cakedeliverycollection.findOne(query)
          res.send(service)
      });
        // order red 
        app.get('/orders', async(req, res)=>{
          
          let  query={};
          if(req.query.email){
             query={
                email: req.query.email,
             }
          }
          const  cursor = cakeOrdercollection.find(query)
          const  result= await cursor.toArray();
          res.send(result)
        })

        // order api 
     app.post('/orders', async(req, res)=>{
         const order =req.body;
         const result= await cakeOrdercollection.insertOne(order)
         res.send(result)
      })
      // orders updtate
      app.patch('/orders/:id', async(req, res)=>{
          const id=req.params.id;
          const status=req.body.status;
          const query={_id: new ObjectId(id)}
          const updtateDoc={
              $set:{
                 status: status ,
              }
          }
          const result= await cakeOrdercollection.updateOne(query, updtateDoc);
          res.send(result)
      })
      // orders delete
      app.delete('/orders/:id', async(req, res)=> {
         const id =req.params.id;
         const query={_id: new ObjectId(id)};
         const result=await cakeOrdercollection.deleteOne(query)
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