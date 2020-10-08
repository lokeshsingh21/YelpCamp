var express=require("express");
var router=express.Router();
var campground=require("../models/campground");
var middleware=require("../middleware");

router.get("/",function(req,res){
    campground.find({},function(err,campgrounds){
        if(err) console.log(err);
        else{
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    });
});

router.post("/",middleware.isloggedin,function(req,res){
   var name=req.body.name;
   var price=req.body.price;
   var image=req.body.image;
   var description=req.body.description;
   var author={
       id: req.user._id,
       username: req.user.username
   };
   campground.create({name,price,image,description,author},function(err,newcampground){
       if(err) console.log(err);
       else{
           res.redirect("/campgrounds");
       }
   });
});

router.get("/new",middleware.isloggedin,function(req,res){
   res.render("campgrounds/new"); 
});

router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err) res.redirect("/");
        else{
            res.render("campgrounds/show",{campground:foundcampground});
        }
    });
});

router.get("/:id/edit",middleware.checkcampgroundownership,function(req,res){
    campground.findById(req.params.id,function(err,foundcampground){
        if(err) res.redirect("/campgrounds");
        else{
            res.render("campgrounds/edit",{campground:foundcampground});
        }
    });
});

router.put("/:id",middleware.checkcampgroundownership,function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground){
       if(err) res.redirect("/campgrounds");
       else{
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

router.delete("/:id",middleware.checkcampgroundownership,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err) res.redirect("/campgrounds");
        else{
            req.flash("success","Campground deleted.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;