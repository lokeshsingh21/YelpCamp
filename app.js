var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var seedDB=require("./seeds");
var flash=require("connect-flash");
var mongoose=require("mongoose");
var user=require("./models/user");
var passport=require("passport");
var localstrategy=require("passport-local");
var methodOverride=require("method-override");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");

// seedDB();

app.use(require("express-session")({
    secret: "lucky_21 is the best coder",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The YelpCamp Server has started!"); 
});