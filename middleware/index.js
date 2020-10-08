var campground=require("../models/campground");
var comment=require("../models/comment");
var middlewareObj={};

middlewareObj.checkcampgroundownership=function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id,function(err,foundcampground){
            if(err){
                req.flash("error","Campground not found.");
                res.redirect("back");
            }
            else if(foundcampground.author.id.equals(req.user._id)){
                return next();
            }
            else{
                req.flash("error","You don't have permission to do that.");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkcommentownership=function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
                req.flash("error","Comment not found.");
                res.redirect("back");
            }
            else if(foundcomment.author.id.equals(req.user._id)){
                return next();
            }
            else{
                req.flash("error","You don't have permission to do that.");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isloggedin=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports=middlewareObj;