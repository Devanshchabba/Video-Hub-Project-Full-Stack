import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})
import dbConnection from './db/index.js'
import {app} from './app.js';
dbConnection()
.then(()=>{
    app.listen(process.env.PORT||8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if the connection fails 
}
)













// (async ()=>{
//     try{
//         await mongooose.connect(`${process.env.DB_URI}/${DB_NAME}`)
//         app.on('error', (err) => {
//             console.log('Error connecting to MongoDB:', err);
//         })


//         app.listen(process.env.PORT,()=>{
//             console.log(`Server is running on port ${process.env.PORT}`)
//         })
//     }catch(err){
//         console.error('Error connecting to MongoDB:', err); 
//         throw err;
//     }
// })()