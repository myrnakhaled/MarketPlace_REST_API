const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
  
    ownedByString:
    {
      type: String,
    },
    items: 
    [{
      productid: {type: String},
      quantity:{type: Number},
      ownedByStore: {type: String},
     
    }],
    totalPrice:{
      type: Number,
      default: 0,
    }

 
})

exports.Store = mongoose.model('Store', storeSchema);
