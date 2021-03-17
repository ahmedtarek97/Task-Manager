const express = require('express');
require('./db/mongoose'); // ensure that the mongoose file will run 
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.port || 3000;

// a middleware
app.use((req, res, next)=>{
    if(req.method === 'GET'){
        res.send('Get request are disabled');
    }else{
        // to signal the end of the midleware
        next();
    }
   
});

app.use((req,res,next)=>{
    res.status(503).send('Site is currently unavilable');
})

app.use(express.json()) // will auromatically parse incoming json to  an object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, ()=>{
    console.log('Server is running');
});

const jwt = require('jsonwebtoken');
const myFunction = async ()=>{
   const token = jwt.sign({_id:'abc123'}, 'thismynodejscourse',{expiresIn:''}); 
   console.log(token);

   const data = jwt.verify(token,'thismynodejscourse');
   console.log(data);
}

myFunction();