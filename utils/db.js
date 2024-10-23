import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const db_uri = process.env.DB_URI || '';

const connectDB = async () => {
    try{
        await mongoose.connect(db_uri).then((data)=>{
            console.log(`Database connected successfully`);
        })
    }catch(error){
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
}

export {connectDB}