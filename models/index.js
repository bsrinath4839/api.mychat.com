const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mobileno: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash :{
        type :String,
        required : true
    },
    token: {
        type: String,
        required: true
    },
    txs: [{
        to: {
            type: String,
            default: null
        },
        from: {
            type: String,
            default: null
        },
        amount: String,
        txid: String,
        txat: String
    }]
})

const txSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    prevHash: {
        type: String
    },
    txhash: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
})

const user = Model("user", userSchema);
const tx = Model('tx', txSchema);
module.exports = {
    user,
    tx
}