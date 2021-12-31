const{Store} = require('../models/store');
const{Product} = require('../models/product');
const{User} = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//1) add the first product to the store(always from this store own prooduts)
router.post(`/`, async (req, res) =>{
// localhost:3000/api/v1/carts?uid=2342342234234&pid=uewui578878
   
     
       
    let store = new Store({
        ownedByString: req.query.uid, 
        items:[{productid: req.query.pid, quantity: req.query.quantity, ownedByStore: req.query.uid }],
        })
    
      store = await store.save();
   
       if(!store) 
       return res.status(500).send('The  first add product to the store cannot be executed')
   
       res.send(store)
   })

  

//2) put another product to the store(whether from ur own ones or other stores'):
//increment quantity of an existing product OR ADD a new product
router.put('/',async (req, res)=> {
     //uid=&pid&ownedbyid
     const temp = await Store.findOne( {'ownedByString': req.query.uid, 'items.productid':req.query.pid})

     //its already in my store (just update quantity)
     if(temp){
         
       //here its only 1 case (its not ur original product)
    
        console.log('TEMP______________-')
      //1) go update the product quantity 

      const product =  await Product.findOneAndUpdate({'_id': req.query.pid},{

         $inc: {'quantity': -1 * req.query.quantity }

        }
        )

      //2)update this doc in items array in the original owner store(ownedbyid)
       const tempstore  =  await Store.findOneAndUpdate({'ownedByString': req.query.ownedbyid, 'items.productid': req.query.pid},{
             
        $inc: {'items.$.quantity': -1 * req.query.quantity }

       })




    //update quantity in your store
    const s = await Store.findOneAndUpdate(
        {'ownedByString': req.query.uid, 'items.productid': req.query.pid},
        {
                          
            $inc: {'items.$.quantity':  req.query.quantity }
        },
        { new: true}
    
    )
    res.send(s)
    }



     
////////////////////////////////////////////////////////////////////////////////////////////////
     //first time to add this product to store
     else{

     
        //if its my own product
    if (req.query.uid == req.query.ownedbyid) {
        //his own product >> just go push it to items array

        const s = await Store.findOneAndUpdate(
            {'ownedByString': req.query.uid},
            {
                              
             $push:{
             items: {'productid' : req.query.pid , 'quantity': req.query.quantity, 'ownedByStore': req.query.uid},
                  
                   }      
    
            },
            { new: true}
        
        )
        res.send(s)
        console.log('yes____________-')

    } 
    
    else {
        console.log('No______________-')
      // not his own product
      //1) go update the product quantity 

      const product =  await Product.findOneAndUpdate({'_id': req.query.pid},{

         $inc: {'quantity': -1 * req.query.quantity }

        }
        )

      //2)update this doc in items array in the original owner store(ownedbyid)
       const tempstore  =  await Store.findOneAndUpdate({'ownedByString': req.query.ownedbyid, 'items.productid': req.query.pid},{
             
        $inc: {'items.$.quantity': -1 * req.query.quantity }

       })

    //3)push this product to the uid store
    const s = await Store.findOneAndUpdate(
        {'ownedByString': req.query.uid},
        {
                          
         $push:{
         items: {'productid' : req.query.pid , 'quantity': req.query.quantity, 'ownedByStore': req.query.ownedbyid},
              
               }      

        },
        { new: true}
    
    )
    res.send(s)
    }

     }
   
   
  });


    ///DELETE a product from the original store (CASCADE DELETE ) ahhhh yarab ;(


        router.delete('/', async(req, res)=>{

            // pid & uid (store id that owns the product) 
            //get ownedbyString array from stores collection

    
        
                const store = await Store.updateMany({},
                    {
                        $pull: {items:
                            {'productid' : req.query.pid}
                           }
                        },
                        { new: true}
                    
                );
            
                if(!store)
                {
                return res.status(500).send('the product cannot be deleted!')
                }


                 //delet Product by pid
        
            Product.findByIdAndRemove(req.query.pid).then(product =>{
                if(product) {
                    return res.status(200).json({success: true, message: 'the product is deleted!'})
                } else {
                    return res.status(404).json({success: false , message: "product not found!"})
                }
            }).catch(err=>{
               return res.status(500).json({success: false, error: err}) 
            })
            
        
            
        })
   


//Buy a product from another store(money gonna be transferred to ownedByStore not the Host)

router.put('/buy',async (req, res)=> {
 //like put pid&uid&ownedbyuid&quantity
   console.log('gggggggggggggggg')
 //1)go update product quantity

  const product =  await Product.findOneAndUpdate({'_id': req.query.pid},{

    $inc: {'quantity': -1 * req.query.quantity }

   }
   )

   //res.send(product)

 //2)update this doc in items array in the original owner store(ownedbyid)
  const tempstore  =  await Store.findOneAndUpdate({'ownedByString': req.query.ownedbyid, 'items.productid': req.query.pid},{     
   $inc: {'items.$.quantity': -1 * req.query.quantity }

  })
 //3)make new product in the product collections with ownedByString = uid

        p1 = new Product({
       
          name: product.name,
          price: product.price,
          category: product.category,
          brand: product.brand,
          ownedByString: req.query.uid,

        })
        p1 = await  p1.save()
        res.send(p1);

   //3)push this product to the uid store
   const s = await Store.findOneAndUpdate(
    {'ownedByString': req.query.uid},
    {
                      
     $push:{
     items: {'productid' : req.query.pid , 'quantity': req.query.quantity, 'ownedByStore': req.query.uid},
          
           }      

    },
    { new: true}

     )

 //4) transfer money to ownedByid

 const user = await User.findOneAndUpdate(
    {'_id': req.query.ownedbyid},
    {
                      
      $inc: {wallet: product.price} 

    },
    { new: true}

     )
  

  

})




module.exports = router;
