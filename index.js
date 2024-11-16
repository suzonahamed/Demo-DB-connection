const express=require('express');
const mongoose = require('mongoose');
const app=express();
const port=3002;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//create schema
     const productSchema=new mongoose.Schema({
            title:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now,
            },
         });
//create model
const Product=mongoose.model("products",productSchema);         

//connection mongoose
const connectionDB=async()=>{

          try {
           await mongoose.connect('mongodb://127.0.0.1:27017/textProducts');
            console.log("db is connected");
          } catch (error) {
                console.log("db is not connected");
                console.log(error.message);
                process.exit(1);
          }


}

app.get("/",(req,res)=>{
    res.send("Welcome to mongoDB");
})
app.post("/products",async(req,res)=>{
    try {
    //    const newProducts= new Product({
    //      title:req.body.title,
    //      price:req.body.price,
    //      rating:req.body.rating,
    //      description:req.body.description,
    //     })
        const productData=await Product.insertMany([
            {
               title:"RedmeNote8",
               price:1820,
               rating:4.9,
               description:"this is nice phone" 
            },
            {
                title:"Nokia",
                price:1200,
                rating:4.5,
                description:"this is beautiful phone" 
             },
             {
                title:"iphon 16",
                price:5200,
                rating:3.5,
                description:"this is awesome phone" 
             },
             {
                title:"sun-glass",
                price:250,
                rating:3,
                description:"this is awesome phone" 
             },
        ]);

        res.status(201).send(productData); 
    } catch (error) {
        res.status(500).send({message:error.message})
    }
})

app.post("/rion",async(req,res)=>{
        const newInfo= new Product({
               title:req.body.title,
               price:req.body.price,
               rating:req.body.rating,
               description:req.body.description
          })
          const rionData= await newInfo.save();
          try {
            if(rionData){
                res.status(201).send({
                    success:true,
                    message:"data are created successfully",
                    data:rionData
                })
            }
            else{
                res.status(404).send({
                    success:false,
                    message:"Sorry! bro...",
        
                })
            }
          } catch (error) {
            res.status(500).send({
                message:error.message,
            })
          }
})

// app.get("/pro",async(req,res)=>{
//   try {
//     const price=req.query.price;
//     const rating=req.query.rating;
//      const products=await Product.find({
//         $or:[
//             {price:{$gt:price}},
//             {rating:{$gt:rating}}
//         ]})

//         .select({
//         _id:1,
//         title:1,
//         price:1,
//         rating:1,
//         description:1
       
//      }).sort({price:1});
       
//    if(products){
//     res.status(200).send({
//         success:true,
//         message:"return all find data",
//         data:products,
//        })
//    }
//    else{
//         res.status(404).send({
//             success:false,
//             message:"Opps! Sorry,we can't find any database", 
            
//         })
//    }
 
//   } catch (error) {
//     res.status(500).send({message:error.message})
//   }
// })
app.get("/pro",async(req,res)=>{
    try {
       const products=await Product.find().sort({price:1});
       if(products){
           res.status(200).send({
           success:true,
           message:"return all find data",
           data:products,
         })
     }
     else{
          res.status(404).send({
              success:false,
              message:"Opps! Sorry,we can't find any database", 
              
          })
     }
   
    } catch (error) {
      res.status(500).send({message:error.message})
    }
  })
app.get("/pro/:id",async(req,res)=>{
    try {
        const id=req.params.id;
     const infoData= await Product.findOne({_id:id},{
        title:1,
        price:1,
        _id:0
     });
   
     if(infoData){
         res.status(200).send({
            success:true,
            message:"return a single data",
            data:infoData
         })
     }else{
         res.status(404).send({
            message:"Data is not found" 
         })
     }
    } catch (error) {
     res.status(500).send({message:error.message})
    }
 })
 app.delete("/afrin/:id",async(req,res)=>{

    try {
        const id=req.params.id;
        const deletedPro=await Product.findByIdAndDelete({_id:id})
        if(deletedPro){
          res.status(200).send({
              success:true,
              message:"delete one product",
              data:deletedPro
          })
        }
        else{
          res.status(404).send({
              message:"Sorry! Product can't find"
          })
        }
    } catch (error) {
        res.status(500).send({message:error.message})
    }

 })

 app.put("/suzon/:id",async(req,res)=>{

    try {
        const id=req.params.id;
        const updateValue=await Product.findByIdAndUpdate({_id:id},
           {
            $set:{
                price:500,
                rating:3.9,
            }
           },
           {new:true}
        )
        if(updateValue){
            res.status(200).send({
                success:true,
                message:"updated product successully",
                data:updateValue
            })
        }
        else{
            res.status(404).send({
                message:"Sorry! Product can't find"
            })
        }
    } catch (error) {
        res.status(500).send({message:error.message})
    }
  
 })

app.listen(port,async()=>{
    console.log(`server is running at http://localhost:${port}`);
   await connectionDB();
})