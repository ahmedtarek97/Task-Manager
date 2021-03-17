const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users', async (req,res)=>{
    const user = new User(req.body);
 
    try{
         await user.save();
         const token = await user.generateAuthToken();
         res.status(201).send({user,token});
    }catch(error){
         res.status(400).send(error); 
    }
 
 });

 router.post('/users/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    }catch(e){
        res.status(400).send();

    }
 })
 
 router.get('/users', async (req,res)=>{
     try{
         // will fetch all users in the database
         const users = await User.find({});
         res.send(users);
     }catch(error){
         res.status(500).send();
     }  
    });
 
router.get('/users/:id', async (req,res)=>{
     const _id = req.params.id;
     try{
         const user = await User.findById(_id);
         if(!user){
             return res.status(404).send();
         }
         res.send(user);
     }catch(error){
         res.status(500).send();
     }    
 })
 
 router.patch('/users/:id', async (req,res)=>{
     const _id = req.params.id;
     // check if the update requst body contains keys that exist in the object needed to be updated
     const updates = Object.keys(req.body);
     const allowedUpdates = ['name','email','password','age'];
     const isValidOperation = updates.every((update)=>{
         return allowedUpdates.includes(update);
     })
     if(!isValidOperation){
         return res.status(400).send({error:'Invalid Updates'});
     }    
     try{
         const user = await User.findById(req.params.id);
         updates.forEach((update)=> user[update] = req.body[update])
         await user.save();
         //the commented line do the same as the above 3 lines but will not allow to 
         // run middlewares so we use the 3 lines
         //const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
         if(!user){
             return res.status(404).send();
         }
         res.send(user);
     }catch(error){
         res.status(400).send();
     }
 })
 
 router.delete('/users/:id', async (req,res)=>{
     const _id = req.params.id;
     try{
         const user = await User.findByIdAndDelete(_id);
         if(!user){
             return res.status(404).send();
         }
         res.send(user);
     }catch{
         res.status(500).send();
     }
 })

 module.exports = router;