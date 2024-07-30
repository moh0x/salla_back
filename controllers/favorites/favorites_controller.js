const { User } = require("../../models/user_model");
const httpsStatus = require('../../constants/https_status');
const { Item } = require("../../models/home/items_model");
const changeFavorites = async(req,res)=>{
   try {
    const token = req.headers.token;
    const itemId = req.body.itemId;
    const user = await User.findOne({token:token},{__v:false,password:false});
    const userId = user.id;
    const item = await Item.findById(itemId);
    if (item.itemLikesArray.includes(userId.toString())) {
        const newFav = [];
       for (let index = 0; index < item.itemLikesArray.length; index++) {
       if (item.itemLikesArray[index] != userId) {
        newFav.unshift(item.itemLikesArray[index]);
       }
     
       }
       const newItemArr =  await Item.findByIdAndUpdate(itemId,{
            $set:{
                itemLikesArray:newFav
            }
        });
        const number= item.itemLikesCount - 1;
        const newItem=  await Item.findByIdAndUpdate(itemId,{
            $set:{
                itemLikesCount:number
            }
        })
        await newItem.save();
        await newItemArr.save();
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":"delete favorites success"});
    } else {
        const newItemArr =    item.itemLikesArray.push(userId);
      
        const number= item.itemLikesCount + 1;
        const newItem=  await Item.findByIdAndUpdate(itemId,{
            $set:{
                itemLikesCount:number,
              
            },$push:{
            itemLikesArray:userId
            }
        })
        await newItem.save();
       
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":"add favorite success"});
    }
    
   } catch (error) {
    console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
   }
}
const getUserFavorites = async(req,res)=>{
   try {
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const token = req.headers.token;
    const user = await User.findOne({token:token},{__v:false,password:false});
   const items = await Item.find({itemActive:true,itemLikesArray:{
    $in:user._id.toString()
   }}).limit(limit).skip(skip);
   res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error) {
    console.log(error);
    res.status(200).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
module.exports = {
    changeFavorites,getUserFavorites
   }