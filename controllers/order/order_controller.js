
const httpsStatus = require('../../constants/https_status');
const { Adress } = require('../../models/adress/adress_model');
const { Deliviry } = require('../../models/deliviry/deliviry_model');
const { Item } = require('../../models/home/items_model');
const { Order } = require('../../models/order/order_model');
const { User } = require('../../models/user_model');
const { Vendor } = require('../../models/vendor/vendor_model');
const addOrder = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const user = await User.findOne({token:token});
     const adresses = await Adress.find({adressUserId:user.id});
     const adressesIds = [];
  if (user.cart.length != 0 ) {
       
    for (let index = 0; index < adresses.length; index++) {
        adressesIds.unshift(adresses[index]['_id'].toString());    
     }
  if (adressesIds.includes(req.body.orderAdress)) {
    for (let index = 0; index < user.cart.length; index++) {
        const item = user.cart[index]['itemId'];
        const product = await Item.findById(item);
        const adress = await Adress.findById(req.body.orderAdress);
        const order = new Order({
            orderUserAdressId:adress.id,
            orderUserAdressCity:adress.adressCity,
            orderUserAdressMiniCipality:adress.adressMiniCipality,
            orderUserAdressDistrict:adress.adressDistrict,
            orderUserEmail:user.email,
            orderUserName:user.userName,
            orderUserPhone:user.phone,
            orderDeliviryId:" ",
            orderDeliviryPhone:" ",
            orderDeliviryEmail:" ",
            orderDeliviryName:" " ,
            orderProductNameArabic:product.itemNameArabic,
            orderProductNameEnglish:product.itemNameEnglish,
            orderVendorEmail:" ",
            orderVendorId:" ",
            orderVendorName:" ",
            orderVendorPhone:" ",
            orderNotAgree:" ",
            orderCount:user.cart[index]['count'],
            orderDetails:user.cart[index]['details'],
            orderFirstDate:Date.now(),
            orderlastDate:Date.now(),
            orderPrice:product.itemDisCount == 0 ? product.itemPrice * user.cart[index]['count'] : product.itemNewPrice * user.cart[index]['count'],
            orderStatusId:"order by user",
            orderUserId:user._id,
            orderProductId:item,
            orderShiping:user.cart[index]['count'] * 500
        });
        await order.save();
    }
     const newUser = await User.findByIdAndUpdate(user.id,{
      $set:{
        cart:[]
      }
    })
    await newUser.save();
    res.status(200).json({"status":httpsStatus.SUCCESS});
  } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null});
  }
  } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null});
  }
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
const deleteOrder = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const user = await User.findOne({token:token});
     const order = await Order.findById(req.body.orderId);
     if (order.orderUserId == user._id) {
       if (order.orderStatusId == "order by user" || order.orderStatusId == "not agree") {
        const orderDelete = await Order.findByIdAndDelete(req.body.orderId);
     
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":"success"});
       } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"you can delete order when status is first"}); 
       }
     } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"you don't have permission"}); 
     }
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const getMyOrders = async(req,res)=>{
   const limit = 15;
   const page = req.body.page || 1;
   const skip = (page - 1) * limit;
    try {
     var token =  req.headers.token;
     const user = await User.findOne({token:token});
     const orders = await Order.find({orderUserId:user._id}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
    
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const getOrderArchive = async(req,res)=>{
  try {
   const limit = 15;
 const page = req.body.page || 1;
 const skip = (page - 1) * limit;
 const token = req.headers.token;
   const user = await User.findOne({token:token});
   const orders = await Order.find({orderStatusId:"archive",orderUserId:user.id}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
  
      res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
 const getMySummary = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const deliviries = await Deliviry.find({isAgree:true}); 
    const vendors = await Vendor.find({isAgree:true}); 
    var orderRet = [];
    var all = 0;
    var sales = 0 ;
    var shipping = 0;
    var myFreeShipping = 0;
    var myFreesales = 0;
    var shippingMoney = 0;
    var salesMoney = 0;
    var myAllFree = 0;
    var allMoney = 0;
    for (let index = 0; index < deliviries.length; index++) {
        shipping = shipping + deliviries[index].shipping;
        myFreeShipping = myFreeShipping + deliviries[index].shippingTax;
        shippingMoney = shippingMoney + deliviries[index].myFreeShipping        
    }
    for (let index = 0; index < vendors.length; index++) {
      sales = sales + vendors[index].sales;
      myFreesales = myFreesales + vendors[index].salesTax;
      salesMoney = salesMoney + vendors[index].myFreeSales        
  }
    all = sales + shipping;
    allMoney = salesMoney + shippingMoney;
    myAllFree = myFreesales + myFreeShipping
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":{
        "all":all,
        "sales":sales,
        "shipping":shipping,
        "salesMoney":salesMoney,
        "shippingMoney":shippingMoney,
        "allMoney":allMoney,
        "myFreeSales":myFreesales,
        "myFreeShipping":myFreeShipping,
        "myAllFree":myAllFree

       }}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }

  }
  const getDelivirySummary = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const deliviry = await Deliviry.findOne({token:token});
     const orders = await Order.find({orderStatusId:"finish",orderDeliviryId:deliviry.id}); 
     var orderRet = [];
     var shipping = 0;
     var myFreeShipping = 0;
     var shippingTax = 0;
     for (let index = 0; index < orders.length; index++) {
         shipping = shipping + orders[index].orderShiping       
     }
    shippingTax = shipping * (14/100);
    myFreeShipping = shipping - shippingTax;
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":{
         "myEarn":shipping,
         "myTax":shippingTax,
         "myFreeEarn":myFreeShipping
 
        }}); 
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }}
const getOrderFirstAdmin = async(req,res)=>{

  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"order by user"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderAgreeAdmin = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"agree"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderNotAgreeAdmin = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"not agree"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderDeliviryAdmin = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"deliviry"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderDeliviriedAdmin = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"deliviried"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderFinishAdmin = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"finish"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderArchiveAdmin = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"archive"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const deleteOrderAdmin = async(req,res)=>{
   try {
   const order = await Order.findById(req.body.orderId);
   if (order) {
    await Order.findByIdAndDelete(req.body.orderId);
   } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
   }
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const archiveOrderAdmin = async(req,res)=>{
  try {
  const order = await Order.findById(req.body.orderId);
  if (order) {
 if (order.orderStatusId == "finish") {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"archive"
    }
  });
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const finshOrderAdmin = async(req,res)=>{
  try {
  const order = await Order.findById(req.body.orderId);
  if (order) {
 if (order.orderStatusId == "deliviried") {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"finish"
    }
  });
  const vendorSer = await Vendor.findById(order.orderVendorId);
 var salesV =  vendorSer.sales + order.orderPrice;
 var vendorTax =  vendorSer.salesTax + (order.orderPrice * (14/100));
 var vendorFree = salesV - vendorTax;
  const vendor = await Vendor.findByIdAndUpdate(order.orderVendorId,{
    $set:{
      sales:salesV,
      salesTax:vendorTax,
      myFreeSales:vendorFree
    }
  });
  const delivirySer = await Deliviry.findById(order.orderDeliviryId);
  var shippingD = delivirySer.shipping + order.orderShiping;
  var DeliviryTax = delivirySer.shippingTax + (order.orderShiping * (5/100));
  var deliviryFree = shippingD - DeliviryTax;
  const deliviry = await Deliviry.findByIdAndUpdate(order.orderDeliviryId,{
    $set:{
      shipping:shippingD,
      shippingTax:DeliviryTax,
      myFreeShipping:deliviryFree
    }
  });
  await deliviry.save();
  await vendor.save();
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const deliviryOrderDeliviry = async(req,res)=>{
  try {
  const order = await Order.findById(req.body.orderId);
  const deliviry = await Deliviry.findOne({token:req.headers.token});
  if (order) {
 if (order.orderStatusId == "agree") {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"deliviry",
      orderDeliviryEmail:deliviry.email,
      orderDeliviryId:deliviry.id,
      orderDeliviryName:deliviry.userName,
      orderDeliviryPhone:deliviry.phone
    }
  });
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const unDeliviryOrderDeliviry = async(req,res)=>{
  try {
  const order = await Order.findById(req.body.orderId);
  const deliviry = await Deliviry.findOne({token:req.headers.token});
  if (order) {
 if (order.orderStatusId == "deliviry" && order.orderDeliviryId == deliviry.id) {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"agree",
      orderDeliviryEmail:" ",
      orderDeliviryId:" ",
      orderDeliviryName:" ",
      orderDeliviryPhone:" "
    }
  });
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const deliviriedOrderDeliviry = async(req,res)=>{
  try {
  const order = await Order.findById(req.body.orderId);
  const deliviry = await Deliviry.findOne({token:req.headers.token});
  if (order) {
 if (order.orderStatusId == "deliviry" && order.orderDeliviryId == deliviry.id) {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"deliviried",
      orderDeliviryEmail:deliviry.email,
      orderDeliviryId:deliviry.id ,
      orderDeliviryName:deliviry.userName,
      orderDeliviryPhone:deliviry.phone
    }
  });
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const getOrderDeliviry = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
  const token = req.headers.token;
  const deliviry = await Deliviry.findOne({token:token});
  const orders = [];
   try {
    const order = await Order.find({orderDeliviryId:deliviry.id}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   for (let index = 0; index < order.length; index++) {
    if (order[index].orderStatusId == "deliviried" || order[index].orderStatusId == "deliviry" || order[index].orderStatusId == "finish") {
      orders.unshift(order[index]);
    }
    
   }
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderAgreeDeliviry = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
   try {
    const orders = await Order.find({orderStatusId:"agree"}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderArchiveDeliviry = async(req,res)=>{
   try {
    const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
  const token = req.headers.token;
    const deliviry = await Deliviry.findOne({token:token});
    const orders = await Order.find({orderStatusId:"archive",orderDeliviryId:deliviry.id}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const deleteOrderVendor = async(req,res)=>{
  try {
    const token = req.headers.token;
    const vendor = await Vendor.findOne({token:token});
  const order = await Order.findById(req.body.orderId);
  if (order   ) {
    
 if (order.orderVendorId == vendor.id) {
  if (order.orderStatusId == "order by user" || order.orderStatusId == "not agree" || order.orderStatusId == "agree") {
    const newOrder =   await Order.findByIdAndDelete(req.body.orderId)
   
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
   } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
   }
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const notAgreeOrderVendor = async(req,res)=>{
  try {
    const token = req.headers.token;
    const vendor = await Vendor.findOne({token:token});
  const order = await Order.findById(req.body.orderId);
  if (order) {
 if (order.orderStatusId == "order by user" && order.orderVendorId == vendor.id || order.orderStatusId == "agree" && order.orderVendorId == vendor.id) {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"not agree",
    }
  });
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const agreeOrderVendor = async(req,res)=>{
  try {
    const token = req.headers.token;
    const vendor = await Vendor.findOne({token:token});
  const order = await Order.findById(req.body.orderId);
  if (order) {
 if (order.orderStatusId == "order by user" && order.orderVendorId == vendor.id || order.orderStatusId == "not agree" && order.orderVendorId == vendor.id) {
  const newOrder =   await Order.findByIdAndUpdate(req.body.orderId,{
    $set:{
      orderStatusId:"agree",
    }
  });
  await newOrder.save();
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":newOrder}); 
 } else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"status fail"});
 }
  } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no order"}); 
  }
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const getOrdersVendor = async(req,res)=>{
  const limit = 15;
  const page = req.body.page || 1;
  const skip = (page - 1) * limit;
  const token = req.headers.token;
   try {
    const vendor = await Vendor.findOne({token:token});
    const orders = await Order.find({orderVendorId:vendor.id}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getOrderArchiveVendor = async(req,res)=>{
 
   try {
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const token = req.headers.token;
  
    const vendor = await Vendor.findOne({token:token});
    const orders = await Order.find({orderStatusId:"archive",orderVendorId:vendor.id}).sort({orderFirstDate:-1}).limit(limit).skip(skip); 
   
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":orders}); 
   } catch (error){
     console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
 module.exports = {
    getMyOrders,addOrder,deleteOrder,getDelivirySummary,getMySummary,getOrderFirstAdmin,getOrderAgreeAdmin,getOrderNotAgreeAdmin,getOrderDeliviryAdmin,getOrderDeliviriedAdmin,getOrderFinishAdmin,getOrderArchiveAdmin,finshOrderAdmin,archiveOrderAdmin,deleteOrderAdmin,getOrderAgreeDeliviry,deliviryOrderDeliviry,deliviriedOrderDeliviry,getOrdersVendor,agreeOrderVendor,deleteOrderVendor,notAgreeOrderVendor,getOrderDeliviry,unDeliviryOrderDeliviry,getOrderArchiveDeliviry,getOrderArchiveVendor,getOrderArchive
   }