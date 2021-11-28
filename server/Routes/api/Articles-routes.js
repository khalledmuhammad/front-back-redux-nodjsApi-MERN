const {Article } = require("../../models/articles-model")
const { User } = require("../../models/user-models");

const express = require("express")
let router = express.Router();
require("dotenv").config();

const { grantAccess } = require("../../middleware/roles");
const {CheckUserExist} = require("../../middleware/auth")
const { sortArgsHelper } = require('../../config/helpers');



router.route("/admin/add-article")
.post(CheckUserExist, grantAccess( "createAny","article") ,async(req,res)=>{
      try {
         /*  const user = await User.findById(req.user._id);
          let username = user.firstname + " " + user.lastname 
          //if i will add the author
          */
          
        const articles = new Article({
            ...req.body,
            score : parseInt(req.body.score)
        })
        const result = await articles.save();
        res.status(200).json(result)
      } catch (error) {
        res.status(400).json({ message: "can;t add article please try again", error: error });

      }
})

router.route("/admin/:artId")
.get(CheckUserExist, grantAccess( "readAny","article") ,async(req,res)=>{
    try {
        const _id = req.params.artId;
        const article = await Article.findById(_id);
        if(!article|| article.length === 0) return res.status(400).json("article not found")
        res.status(200).json(article)
    } catch (error) {
        res.status(400).json({ message: "can't add article please try again", error: error });

    }
})
.patch(CheckUserExist, grantAccess( "updateAny","article") ,async(req,res)=>{
    try {
        const _id = req.params.artId;
        const article = await Article.findOneAndUpdate({_id} , {
            $set : {
                ...req.body
            }
        } , {new : true});
        if(!article) return res.status(400).json("article not found")
        res.status(200).json(article)
    } catch (error) {
        res.status(400).json({ message: "can't update article please try again", error: error });

    }
})
 .delete(CheckUserExist, grantAccess( "deleteAny","article") ,async(req,res)=>{

    try {
        const _id = req.params.artId;
        const article = await Article.findOneAndDelete(_id)
        if(!article) return res.status(400).json("article not found")
        res.status(200).json("article deleted successfully")

    } catch (error) {
        res.status(400).json({ message: "can't delete article please try again", error: error });

    }
 })
 
router.route("/admin/paginate")
.post(CheckUserExist,grantAccess('readAny','articles'),async(req,res)=>{
    try{

        // let aggQuery = Article.aggregate([
        //     { $match: { status:"public" }},
        //     { $match: { title:{ $regex:/Lorem/ }}}
        // ])

        const limit = req.body.limit ?  req.body.limit : 5;
        const aggQuery = Article.aggregate();
        const options = {
            page: req.body.page,
            limit,
            sort:{_id:'asc'}
        }

        const articles = await Article.aggregatePaginate(aggQuery,options);
        res.status(200).json(articles)
    } catch(error){
        res.status(400).json({message:'Error',error});
    }
})


 /* no auth required */
router.route("/get-article/:artId")
.get(async(req,res)=>{
    try {
        const _id = req.params.artId;
        const article = await Article.find({_id , status : "public"});
        if(!article|| article.length === 0) return res.status(400).json("article not found")
        res.status(200).json(article)
    } catch (error) {
        res.status(400).json({ message: " error fetching rticle", error: error });

    }
})

router.route("/loadmore")
.post(async(req,res)=>{
    try{
        let sortArgs = sortArgsHelper(req.body)

        const articles = await Article
        .find({status:'public'})
        .sort([[sortArgs.sortBy,sortArgs.order]])
        .skip(sortArgs.skip)
        .limit(sortArgs.limit);
        
        res.status(200).json(articles)
    } catch(error){
        console.log(error)
        res.status(400).json({message:'Error fetching articles',error});
    }
})
module.exports = router;
