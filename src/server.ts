import express from 'express';
import { AppDataSource } from './config/database.config';


AppDataSource.initialize().then(() => {
    const app = express();
    app.use(express.json());
    app.listen(process.env.PORT, () => {
        console.log(`
            Server is running on port http://localhost:${process.env.PORT}`)
        ;
    });
});