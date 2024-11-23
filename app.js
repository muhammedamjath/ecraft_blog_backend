const { urlencoded } = require('body-parser')
const express = require('express')
require('dotenv').config()
const app = express()
const path = require('path');
const cors = require ('cors')

const port = process.env.PORT

const corsOptions = {
    origin: '*', 
    optionsSuccessStatus: 200,
  };
  
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cors(corsOptions))

app.use('/public', express.static(path.join(__dirname, 'public')));


const dbConnect = require('./config/connection')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRouter')

app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/admin',adminRouter)




dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error("Database connection failed:", err);
});


