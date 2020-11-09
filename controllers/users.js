const express =require('express');
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const session = require("express-session");
// const {createRequireFromPath}=require ("module")

router.get('/',(req,res)=>{
    db.users.findAll().then(users=>{
        res.json(users)
    }).catch(err=>{
        console.log(err);
        res.status(500).end()
    })
})


router.post("/createAccount",(req,res)=>{
    db.users.create({
       first_name:req.body.first_name,
       last_name:req.body.last_name,
       age:req.body.age,
       email:req.body.email,
       phoneNumber: req.body.phoneNumber,
       password:req.body.password,
       bio: req.body.bio
    }).then(newUser => {
        res.json(newUser);
    }).catch(err=>{
        console.log(err);
        res.status(500).end();
    })
})
router.post("/login", (req, res) => {
    console.log(req.body.email)
    db.users.findOne({
    
        where:{
            email: req.body.email
        }
    }).then(users => {
       if(!users){
           res.status(404).send("This user does not exist!");
       }else{
           if(bcrypt.compareSync(req.body.password, users.password)){
               req.session.users ={
                first_name:users.first_name,
                last_name:users.last_name,
                email:users.email,
                id:users.id
               }
               res.send(req.session.users);
           }else{
               res.status(401).send("wrong password ")
        }
       } 
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
})



router.get('/readsessions',(req,res)=>{
    console.log(req.session)
    res.json(req.session);
})




//Route to get all users Event cards rendered on home page via the event viewer
// router.get("/userData", (req, res) => {
//     if (!req.session.user) {
//         res.status(401).send("login required ")
//     } else {
//         db.users.findAll({
//             where: {
//                 id: req.session.users.id
//             },
//             include: [
//                 {model:db.events,
//                     include:[db.EventViewer]
//                 }, 
//                 db.events]
//         }).then(userData => {
//             res.json(userData)
//         }).catch(err => {
//             console.log(err);
//             res.status(500).end()
//         })
//     }
// })




router.put("/update/:id", function (req, res) {

    db.users.update(
        {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            email: req.body.email,
            phoneNumber:req.body.phoneNumber
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(function (db) {
        res.json(db.users);
    }).catch(function (err) {
        res.status(500).json(err);
    });
});

router.delete("/delete/:id", function (req, res) {
    db.users.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (dbUsers) {
        res.json(`destroyed the user account with id of ${req.params.id}`);
    }).catch(function (err) {
        res.status(500).json(err);
    });
});



router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.send("logout complete!")
})

module.exports =router;
