const express = require('express');
const app =express();
const cors = require('cors');
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.get('/', (req, res)=>{
    res.send('cake service server runing')
})

app.listen(port, ()=>{
  console.log(`cake service server runing port: ${port}`)
})