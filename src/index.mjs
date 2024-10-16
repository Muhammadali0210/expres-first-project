import express from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import mongoose from 'mongoose';
import userRouter from './routes/user.mjs';
import productRouter from './routes/product.mjs';
import authRouter from './utils/auth.mjs';


const app = express();

mongoose
    .connect('mongodb://localhost/express-tutorial')
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((error) => { console.log(error); });

// Swagger sozlamalari
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
        title: "My Express API",
        version: "1.0.0",
        description: "My API documentation with Swagger",
        },
        servers: [
        {
            url: "http://localhost:3001",
        },
        ],
    },
    apis: ["./src/utils/auth.mjs", "./src/routes/*.mjs"], // Faqat routes fayllarini kiriting
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// CORS ni yoqish
app.use(cors());  // Bu barcha kelgan domenlar uchun CORS ni yoqadi

app.use(userRouter, productRouter, authRouter);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port!`);
    console.log(`API Docs available on http://localhost:3001/api-docs`);
});










