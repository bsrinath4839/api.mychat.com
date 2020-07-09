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
    passwordHash: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    txs: [{
        to: {
            type: Object,
            default: null
        },
        from: {
            type: Object,
            default: null
        },
        txhash: {
            type: String,
            default: null
        },
        amount: {
            type: String,
            default: null
        },
        txat: {
            type: Date,
            default: Date.now
        }
    }]
})

const txSchema = new Schema({
    from: {
        type: String,
        default: "",
    },
    to: {
        type: String,
        default: "",
    },
    prevHash: {
        type: String,
        default: "",
    },
    rand: {
        type: String,
        default: "",
    },
    txhash: {
        type: String,
        default: "",
    },
    amount: {
        type: Number,
        default: 0,
    },
    txat: {
        type: Date,
        default: Date.now
    }
})

const user = Model("user", userSchema);
const tx = Model('tx', txSchema);
module.exports = {
    user,
    tx
}