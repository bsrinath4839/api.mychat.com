const { user, tx } = require('../models')

const populater = [];

const userLogin = async (findOption, cb) => {
    await user.findOne(findOption)
        .populate(populater)
        .exec({}, cb);
}

const createUser = async (findOption, cb) => {
    await userLogin(findOption, (err, result) => {
        if (err) {
            cb(err, null)
        } else if (result) {
            cb({ "ERROR": "USER ALREADY EXIST" }, null)
        } else {
            const newUser = new user(findOption)
            newUser.save((err) => {
                if (err) {
                    cb(err, null)
                } else {
                    user.populate(newUser, populater, cb)
                }
            })
        }
    })
}

const getUser = async (token, cb) => {
    await user.findOne(token)
        .populate(populater)
        .exec({}, cb);
}

const newTx = async (user, transaction, options, cb) => {
    await userLogin(user, async (err, result) => {
        if (err) {
            cb(err, null)
        } else if (result) {
            await user.findByIdAndUpdate(user, transaction, options)
                .populate(populater).exec({})

            const newtx = new tx(transaction);
            tx.save((err) => {
                if (err) {
                    cb(err, null)
                } else {
                    tx.populate(newtx, populater, cb)
                }
            })
        }
    })
}

const loadUsersTo = async (findOption, cb) => {
    let token = findOption.token;
   // console.log("toke", token);

    await getUser({ token }, async (err, validuser) => {
        if (err) {
            cb(err, null)
        } else if (validuser) {
            await user.find({ "mobileno": { "$regex": findOption.mobileno, "$options": "i" } })
                .select({ "name": 1, "mobileno": 1 })
                .sort({ "name": 1   })
                .limit(10)
                .populate(populater)
                .exec({}, cb)
        } else {
            cb(null, null)
        }
    })
}

module.exports = {
    newTx,
    createUser,
    userLogin,
    getUser,
    loadUsersTo,
}
