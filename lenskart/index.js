var express = require('express');
var multer = require('multer');
var bcrypt = require('bcrypt');
const router = express.Router();

var MainCategory = require('../schema/maincategory');
var SubCategory=require('../schema/subCategory');
var User=require('../schema/User');
var Product=require('../schema/product');
var Checkout=require('../schema/checkout');
var Order=require('../schema/order');
var OrderDetail=require('../schema/orderdetail')
router.use(express.json());
const jwthelper = require('../helper/jwtHelper');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now());
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"||file.mimetype === "image/PNG")
        cb(null, true);
    else {
        req.fileValidationError = 'Only Image file are allowed!!';
        cb(new Error('Only Image file are allowed!!'), false);
    }
}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('image');


router.post('/createUser', async function (req, res) {
     const body = req.body;
        let hash = bcrypt.hashSync(body.password, 5);
        try {
            body.password = hash;
            var user = await User.create(body);
            return res.status(200).json(user);
        }
        catch (error) { 
            return res.status(500).send(error);
        }
});

router.post('/login', async function (req, res, next) {
    const body = req.body;
    try {
        if(body.email!=''){
            var user = await User.findOne({ email: body.email });
        }
        else if(body.mobileno!=''){
            var user = await User.findOne({ mobileno: body.mobileno });
        }
        req.oldpwd = user.password;
        return next();
    } catch (error) {
        return res.status(500).send('Username is invalid!!');
    }
},
    async function (req, res) {
        const body = req.body;
        try {
            const match = await bcrypt.compare(body.password, req.oldpwd);
            if (match) {
                var user = await User.findOne({ password: req.oldpwd });
                var token = await jwthelper.sign(user._id, "some secret");
                return res.status(200).json({ "Id": user._id, "userrole": user.userrole, "token": token });
            }
            else
                return res.status(500).send('Password is invalid!!');
        } catch (error) {
            return res.status(500).send('Username or Password is invalid!!');
        }
    });

router.post('/createmaincategory', async function (req, res) {
    const body=req.body
    try {
        var maincategory = await MainCategory.create(body);
        return res.status(200).json(maincategory);
    }
    catch (error) {
        if (error.code == 11000)
            return res.status(500).send('duplicate maincategory is not allowed');
        return res.status(500).send('an error occured while create mainCategory');
    }
});
router.post('/createsubcategory', async function (req, res) {
    const body=req.body
    try {
       var maincat=await MainCategory.findOne({MainCategoryname:body.MaincatName})
        var subcategory = await SubCategory.create({SubCategoryname:body.SubCateName,mainCategoryId:maincat._id});
        return res.status(200).json(subcategory);
    }
    catch (error) {
        return res.status(500).send('an error occured while create subCategory');
    }
});

router.get('/listmaincategory', async function (req, res) {
    try {
        var maincategory = await MainCategory.find({});
        return res.status(200).json(maincategory);
    }
    catch (error) {
        return res.status(500).send('an error occured get list of Main Category');
    }
});
router.get('/listsubcategory/:maincatnm', async function (req, res) {
    try {
       var maincategory=await MainCategory.findOne({MainCategoryname:req.params.maincatnm})
       var subcategory = await SubCategory.find({mainCategoryId:maincategory._id});
    
        return res.status(200).json(subcategory);
    }
    catch (error) {
        return res.status(500).send('an error occured get list of Sub Category');
    }
});
router.get('/listallsubcategory', async function (req, res) {
    try {
        var subcategory = await SubCategory.find();
        return res.status(200).json(subcategory);
    }
    catch (error) {
        return res.status(500).send('an error occured get list of All Sub Category');
    }
});
router.post('/createProduct', async function (req, res) {
    upload(req, res, async function (err) {
        if (req.fileValidationError)
            return res.status(500).send(req.fileValidationError);
        const body = req.body;
        try {
            var subcat=await SubCategory.findOne({SubCategoryname:body.subCatnm})
            var product = await Product.create({ ...body, image: req.file.filename,SubCategoryId:subcat._id });
            return res.status(200).json(product);
        }
        catch (error) {
            return res.status(500).send('an error occured while create Product');
        }
    })
});
router.get('/listproduct/:subcatnm',async function(req,res){
    try{
        var subcategory = await SubCategory.findOne({SubCategoryname:req.params.subcatnm});
        var product=await Product.find({SubCategoryId:subcategory._id})
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).send('an error occured while get Product');
    }
})
router.get('/listproductsucatwise',async function(req,res){
    try{
       var product = await Product.aggregate([
               {
                   $lookup:{
                       from:"SubCategory",
                       localField:"SubCategoryId",
                       foreignField:"_id",
                       as :"sub"
                   }
               },
               {
               $project:{
               "qty":1,
               "ProductName":1,
               "price":1,
               "description":1,
               "image":1,
               "SubCategoryId":1,
                "sub.SubCategoryname":1
                }
            }
           ])
       return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).send('an error occured while get Product');
    }
})
router.post('/createcheckout', async function (req, res) {
    const body=req.body
    try {
        if(body.islogging==true && body.email!="")
        {
            var user=await User.findOne({email:body.email})
            body.loginuserid=user._id
            body.mobileno=user.mobileno
        }
        else if(body.islogging==true && body.mobileno!=""){
            var user=await User.findOne({mobileno:body.mobileno})
            body.loginuserid=user._id
        }
        var checkout = await Checkout.create(body);
        return res.status(200).json(checkout);
    }
    catch (error) {
        return res.status(500).send('an error occured while create checkout');
    }
});
router.post('/createorder', async function (req, res) {
    const body=req.body
    try {
        if(body.order.islogging==true && body.order.email!="")
        {
            var user=await User.findOne({email:body.order.email})
            body.order.UserId=user._id
            var checkout = await Checkout.findOne({loginuserid:body.order.UserId}).sort({"updatedAt":-1});
        }
        else if(body.order.islogging==true && body.order.mobileno!=""){
            var user=await User.findOne({mobileno:body.order.mobileno})
            body.order.UserId=user._id
            var checkout = await Checkout.findOne({loginuserid:body.order.UserId}).sort({"updatedAt":-1});
        }
        else{
            var checkout=await Checkout.findOne({mobileno:body.order.mobileno,email:body.order.email}).sort({"updatedAt":-1});
        }
        var order=await Order.create({...body.order,CheckoutId:checkout._id});
        console.log("body==",order)
        body.orderdetail.forEach( async productdata => {
            var product=await Product.findOne({ProductName:productdata.ProductName})
            let newqty=product.qty-productdata.qty
            product.qty=newqty
            var product=await Product.findByIdAndUpdate(product._id,product)
            var orderdetail=await OrderDetail.create({OrderId:order._id,ProductId:product._id,price:productdata.price,qty:productdata.qty})
            console.log("orderdetail==",orderdetail)
        });
        
        return res.status(200).json(order);
    }
    catch (error) {
        return res.status(500).send('an error occured while create order detail');
    }
});
router.put('/getproductcart', async function (req, res) {
    const body=req.body
    try {
        var checkuser = await jwthelper.verify(body.accesstoken, "some secret");
        var user1=await User.findOne({_id:checkuser.data._id})
        return res.status(200).json(user1.usercart);
    }
    catch (error) {
        return res.status(500).send('an error occured while getting cart product');
    }
});
router.put('/addtocart', async function (req, res) {
    const body=req.body
    try {
        var checkuser = await jwthelper.verify(body.accesstoken, "some secret");
        var user1=await User.findOne({_id:checkuser.data._id})
        user1.usercart=[...user1.usercart,body.cartproduct]
       var user2=await User.findByIdAndUpdate(checkuser.data._id,user1)
       console.log("user2==",user1.usercart)
        return res.status(200).json(user1.usercart);
    }
    catch (error) {
        return res.status(500).send('an error occured while add product into cart');
    }
});
router.put('/removecartproduct', async function (req, res) {
    const body=req.body
    try {
        var checkuser = await jwthelper.verify(body.accesstoken, "some secret");
        var user1=await User.findOne({_id:checkuser.data._id})
        let newArray=[];
        for(i=0;i<user1.usercart.length;i++){
            if(user1.usercart[i]._id!=body.cartproduct._id){
                newArray=[...newArray,user1.usercart[i]]
            }
        }
        user1.usercart=newArray
       var user2=await User.findByIdAndUpdate(checkuser.data._id,user1)
        return res.status(200).json(user2);
    }
    catch (error) {
        return res.status(500).send('an error occured while add product into cart');
    }
});
module.exports = router;