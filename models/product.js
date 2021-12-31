const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        //required: true
    },
    image: {
        type: String,
        default: ''
    },
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: {
        type: String,
       

    },
     
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    ownedByString: {type: String},
 
     quantity:{type: Number}
    
  
 
});

//i will use Product as a mapping to this model(collection)
exports.Product = mongoose.model('Product',productSchema);
