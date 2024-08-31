const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(express.json());

const posts= [
    {
        username:'mohamed',
        title:'post1'
    },
    {
        username:'ahmed',
        title:'post2'
    }
]

app.get('/posts',authenticatetoken,(req,res)=>{
    res.json(posts.filter(posts=>posts.username===req.user.name));
})

function authenticatetoken(req,res,next){
    const authheader = req.headers['authorization'];
    const token = authheader && authheader.split(' ')[1];
    if(token==null) return res.sendStatus(401);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}


app.listen(3000);