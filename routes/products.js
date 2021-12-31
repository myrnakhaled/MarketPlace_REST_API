const{Product} = require('../models/product');
const{Store} = require('../models/store');
const{User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


////to view a certain user(store) own products On His Store (m4 al 3nd nas tania bttba3)
router.get(`/`, async (req, res) =>{    
// localhost:3000/api/v1/products?uid 
    const product = await Product.find({'ownedByString': req.query.uid })
    res.send(product)
 
    


})

//1)SEARCH by  Category
router.get(`/search`, async (req, res) =>{

// localhost:3000/api/v1/products?categories=2342342,234234
    let filter = {};
    if(req.query.categories)
    {
        console.log(req.query.categories);
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).limit(3);

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})

//add a NEW product to a certain user(store) uid = store_id
 router.post(`/`, async (req, res) =>{
 // localhost:3000/api/v1/products?uid=2342342234234
 
     console.log(req.query.uid);

let product = new Product({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    ownedByString: req.query.uid,
    quantity: req.query.quantity,
   })
   product.save();
   if(!product)
   return res.status(500).send('the product cannot be updated!')

   //add this product to the user store 
  

   res.send(product);
})


//3)Modify an existing product
//hwa sa7eb al store w das 3la  HIS OWN Product to modify 
router.put('/',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.query.pid)) {
       return res.status(400).send('Invalid Product Id')
    }

   const product = await Product.findOneAndUpdate(
    {'_id':req.query.pid, 'ownedByString':req.query.uid},
    {
         name: req.body.name,
         description: req.body.description,
         image: req.body.image,
         brand: req.body.brand,
         price: req.body.price,
         category: req.body.category,
        $inc: {quantity: req.query.quantity},
      
    },
     
    
    { new: true}
    
     );

if(!product)
{
return res.status(500).send('the product cannot be updated!')
}
res.send(product);
})



//4)DELETE a product
router.delete('/', async(req, res)=>{

    // pid & uid(ownedByString)(Store owner)
  
   //loop on each store to remove this product from their store


        const store = await Store.Update(       
            {
                $pull: {items:
                   
                    {'productid' : req.query.pid , 'ownedByStore': req.query.uid }
                   }
                },
                { new: true}
            
        );
    
        if(!store)
        {
        return res.status(500).send('the cart cannot be deleted!')
        }
    
        res.send(store);
        return res.status(200).json({success: true, message: 'the product is deleted from all stores!'})
           
    
})

module.exports = router;
