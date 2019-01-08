var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyparser = require("body-parser");
var local = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var user = require("./models/user");
var app = express();
var methodOveride= require("method-override");
var flash = require("connect-flash");
app.use(require("express-session")({
    secret:"xyz",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/deapp");

app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(function(req,res,next){           //A middleware that will run on each app requests
    res.locals.curruser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

app.use(methodOveride("_method"));
 
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome "+ user.username);
            res.redirect("/quiz");
        })
    })
})

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/quiz",function(req,res){
    res.render("quiz");
})

app.post("/login",passport.authenticate("local",{
     successRedirect:"/quiz",
     failureRedirect:"/login"
}),
function(req,res){});
app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","logged you out");
    res.render("login");
})
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first");
    res.redirect("/login");
}
app.listen(process.env.PORT,process.env.IP);
