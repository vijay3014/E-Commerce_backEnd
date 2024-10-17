import express from 'express';
import dotenv from 'dotenv';
import { DBUtil } from './db/dbUtil';
import userRouter from "./routes/users/userRouter";
import productRouter from "./routes/products/productRouter";
import addressRouter from './routes/address/addressRouter';
import categoriesRouter from './routes/categories/categories';
import cartRouter from './routes/cart/cartRouter';
const app: express.Application = express();

// configure dot-env
dotenv.config({
    path: "./.env"
})

// configure express to read form data
app.use(express.json());

const port : Number | undefined  =  Number(process.env.PORT)||9000;
const dbUrl : string | undefined = process.env.MONGO_URL;
const dbName : string | undefined = process.env.MONGO_DB_NAME;


app.get('/', (request, response)=>{
        response.send('Welcome to Express');
});

app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/address',addressRouter);
app.use('/api/categories',categoriesRouter);
app.use('/api/carts',cartRouter);

//Server and DB connection
if(port && dbUrl && dbName){
    app.listen(port, ()=>{
        if (dbUrl && dbName) {
            DBUtil.connectToDB(dbUrl, dbName).then((dbResponse) => {
                console.log(dbResponse);
            }).catch((error) => {
                console.error(error);
                process.exit(0); // stops the node js process
            });
        }     console.log(`Server start at ${port}...`);
    })
}