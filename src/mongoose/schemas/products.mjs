import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
    },
    price: mongoose.Schema.Types.Number
});

export const Product = mongoose.model('Product', productSchema)