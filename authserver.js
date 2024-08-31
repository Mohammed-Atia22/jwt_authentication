const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();


app.use(express.json());

let refreshtokens = [];
app.post('/token',(req,res)=>{
    const refreshtoken = req.body.token;
    if(refreshtoken==null) return res.sendStatus(401);
    if(!refreshtokens.includes(refreshtoken)) return res.sendStatus(403);
    jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        const accesstoken = generateaccesstoken({name:user.name});
        res.json({accesstoken:accesstoken});
    })
})

app.delete('/logout',(req,res)=>{
    refreshtokens = refreshtokens.filter(token=> token !== req.body.token);
    req.sendStatus(204);
})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const user = {name:username};
    const accesstoken = generateaccesstoken(user);
    const refreshtoken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    refreshtokens.push(refreshtoken);
    res.json({accesstoken:accesstoken,refreshtoken:refreshtoken});
})

function generateaccesstoken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30s'});
}




app.listen(3000);