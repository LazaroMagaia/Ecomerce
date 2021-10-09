
//EXPRESS
const express = require('express');
const app = express();
//DOTENV
const dotenv = require('dotenv');
dotenv.config();
//DATA BASE
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL,{
    /*useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true*/
})
.then( () => console.log("Banco de dados connectado com sucesso"))
.catch( (err) => console.log(err));

//ROUTES
app.use(express.json());
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order")
app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.listen(process.env.PORT,() => {
    console.log("Server online na porta "+process.env.PORT);
});