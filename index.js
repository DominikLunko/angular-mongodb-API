import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import movieRoutes from './routes/movies.js';
// import userRoutes from './routes/users.js';

const app = express();
dotenv.config();


app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// app.use('/movies', movieRoutes);
// app.use('/users', userRoutes);

// const CONNECTION_URL = 'mongodb://dominikLunko:dominikLunko123@cluster0-shard-00-00.6y2wy.mongodb.net:27017,cluster0-shard-00-01.6y2wy.mongodb.net:27017,cluster0-shard-00-02.6y2wy.mongodb.net:27017/baza?ssl=true&replicaSet=atlas-111r0u-shard-0&authSource=admin&retryWrites=true&w=majority';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ˘${PORT}`)))
    .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);