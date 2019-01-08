
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyparser = require("body-parser");
var local = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var User = require("./models/user");
var app = express();
var http = require('http').Server(app);
app.use(require("express-session")({
    secret:"xyz",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/authoapp");
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){
    res.render("home");
})

app.get("/secret",isloggedin,function(req,res){
    res.render("secret");
})

app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
   User.register(new User({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       else{
           passport.authenticate("local")(req,res,function(){
              res.redirect("/secret");
           });
       }
   })
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",{
   successRedirect:"/secret",
   failureRedirect:"/login"
}),function(req,res){
});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.get("/chat",function(req,res){
    res.render("chat");
});


var io = require('socket.io')(http);
app.get('/', function(req, res){
  res.sendfile('index.html');
});
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
