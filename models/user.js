
const mongoose = require('mongoose');
const { isInteger } = require('prettier');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    //ya3ny owner lstore wla customer
   
    address: {
        type: String,
        default: ''
    },
    
    wallet: {
    type: Number,
    default: 0,

    }
  
  

});
//jm5od el id kda m4 _id as it is more front end friendly
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
