import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: mongoose.Schema.Types.Number,
    nickname: mongoose.Schema.Types.String,
    password: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    }
});

export const User = mongoose.model('User', userSchema);