//for every libiraries we create const
const express = require('express');
const app = express();
const morgan = require ('morgan');
const mongoose=require('mongoose');
const cors = require('cors');
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler =require('./helpers/error-handler');
//to connect to any front 
app.use(cors());
app.options('*',cors())
//middleware
app.use(express.json());
app.use(morgan('tiny'));
// if user is authenticated or not
//ana 3mlt comment llstr dah 34an by3ml moshkla m4 adra a7ddha  
//app.use(authJwt());
app.use(errorHandler);

//routers

const users=require('./routes/users');
const store = require('./routes/stores');
const productsRoutes = require('./routes/products');


const api = process.env.API_URL;

app.use(`${api}/users`,users.router);
app.use(`${api}/stores`, store);
app.use(`${api}/products`,  productsRoutes);



//connect to DB URI
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('database connected');
})
.catch((err)=>{
    console.log(err);
})
app.listen(3000,()=>{

    console.log('running on http://localhost:3000');
});

 
 
