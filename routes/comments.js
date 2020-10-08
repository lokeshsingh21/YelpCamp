var express=require("express");
var router=express.Router({mergeParams: true});
var campground=require("../models/campground");
var comment=require("../models/comment");
var middleware=require("../middleware");

router.get("/new",middleware.isloggedin,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err) console.log(err);
        else res.render("comments/new",{campground:campground});
    });
});

router.post("/",middleware.isloggedin,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            comment.create(req.body.comment,function(err,comment){
                if(err) console.log(err);
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment.");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit",middleware.checkcommentownership,function(req,res){
    comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err) res.redirect("back");
        else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundcomment});
        }
    });
});

router.put("/:comment_id",middleware.checkcommentownership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updcomment){
        if(err) res.redirect("back");
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:comment_id",middleware.checkcommentownership,function(req,res){
   comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err) res.redirect("back");
       else{
           req.flash("success","Comment deleted.");
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
});

module.exports=router;