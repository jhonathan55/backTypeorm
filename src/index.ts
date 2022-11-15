import * as express from "express";
import { AppDataSource } from "./data-source";
import routes from './routes';
import * as cors from 'cors';
import "reflect-metadata";

const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(async () => {
    // create express app
    const app = express();
    //utilizamos cors para interactuar con el cliente
    app.use(cors());
    app.use(express.json());
    //router
    app.use('/',routes);
    // start express server
    app.listen(PORT,()=> console.log(`server ok ${PORT}`));

}).catch(error => console.log(error))
