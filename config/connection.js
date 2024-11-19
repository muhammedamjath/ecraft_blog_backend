const mongoose =require('mongoose')

async function dbConnect(){
    await mongoose.connect(process.env.MONGOOSEURL,{
        dbName:'ecraftBlog'
    })
    .then (() =>{
        console.log('mongodb connected successfully');
        
    })
    .catch (()=>{
        console.log('mongodb not connected');
        
    })
}

module.exports = dbConnect