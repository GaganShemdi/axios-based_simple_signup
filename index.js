const express = require("express")
const jwt = require("jsonwebtoken");
const JWT_SECERET = "gaganisop"
const app=express();


app.use(express.json()); // .body can be used to pickup from body



const users =[];


app.get('/',function(req,res){
    res.sendFile(__dirname+ "/public/index.html");
})

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username:username,
        password:password
    })
    res.json({
        message : "You have been signed up"
    })
})


app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    let token = '';

    let foundUser = null;
    for(let i=0;i<users.length;i++){
        if(users[i].username === username && users[i].password===password){
            foundUser = users[i];
        }
    }
    if(foundUser){
    token = jwt.sign({
        username: users[i].username },JWT_SECERET);

    res.json({
        token:token
    })
}
    else{
        res.status(403).json({
            message:"Error Occurred"
        })
    }

})


function auth(req,res,next){//Middle Ware
    const token = req.headers.token;
    const decodedInfo = jwt.verify(token,JWT_SECERET);
    req.username = decodedInfo.username;
    if(decodedInfo.username){
        next()
    }else{
        res.json({
            message:"The user is not validated"
        })
    }
}


app.get("/me",auth,function(req,res){
    
        let foundUser =null;
        for(let i=0;i<users.length;i++){
            if(users[i].username === req.username){
                foundUser = users[i]
            }
        }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    })
    
    
})


app.listen(3003);