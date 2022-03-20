const express = require("express")
const { body, validationResult } = require('express-validator');
const User = require("../models/user.model")

const router = express.Router()

// const express = require("express");
// const { body, validationResult } = require("express-validator");

// const User = require("../models/user.model");

// const router = express.Router();

router.get("/",async(req,res)=>{
    try{
        const user = await User.find().lean().exec()
        return res.status(200).send(user)
    }
    catch(err)
    {
        console.log(err.message)
    }
});

router.post("/",body("firstName").trim().not().isEmpty(),
body("lastName").trim().not().isEmpty(),
body("email").trim().not().isEmpty().isEmail().
    custom(async(value)=>{
        const user = await User.findOne({email:value})
        if(user)
        {
            throw new Error("email already register")
        }
        return true
    }),

    body("pincode").trim().not().isEmpty().isNumeric().
    custom(async(val)=>{
        if(val.toString !=6)
        {
            throw new Error("pincode must contain 6 digit ")
        }
        return true
    }),
    body("age").trim().not().isEmpty().isNumeric().
    custom(async(value)=>{
        if(value<1 || value>100)
        {
            throw new Error("age is invalid")
        }
        return true
    }),
    body("gender").not().isEmpty().
    custom(async(value)=>{
        let obj={
            Male:true,
            Female:true,
            female:true,
            male:true,
            Others:true,
            others:true
        }
        if(obj[value]!=true)
        {
            throw new Error("gender should be male or female or others")
        }
        return true
    }),
    async (req, res) => {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            
          const user = await User.create(req.body);
          return res.status(200).send(user);
        } catch (error) {
          return res.status(500).send(error.message);
        }
      }
    );

    // async (req, res) => {
    //     try {
    //       console.log(body("firstName"));
    //       const errors = validationResult(req);
    //       console.log({ errors });
    //       if (!errors.isEmpty()) {
    //         return res.status(400).send({ errors: errors.array() });
    //       }
    
    //       const user = await User.create(req.body);
    
    //       return res.status(201).send(user);
    //     } catch (err) {
    //       return res.status(500).send({ message: err.message });
    //     }
    //   }
    // );
    
    module.exports = router;

