const path = require("path")
const fs = require("fs")
const fileUtils = require("../fileUtil")
const userHandler = (function() {

    function createUser(data, callback) {
        let firstName = typeof (data.payload.firstName) === "string" && data.payload.firstName.length > 0? data.payload.firstName : false
        let lastName = typeof (data.payload.lastName) === "string" && data.payload.lastName.length > 0? data.payload.lastName : false
        let phone = typeof (data.payload.phone) === "string" && !isNaN(parseInt(data.payload.phone)) && data.payload.phone.trim().length == 11? data.payload.phone : false
        console.log(fileUtils.baseDir);
        let userPath = path.join(fileUtils.baseDir, "users/", phone + ".json")

        fs.exists(userPath, (user) => {
            console.log(userPath);
            if(user)  callback(401, {message: "user already exist"})
        })
        
        if(firstName && lastName && phone) {
            fileUtils.create("users", phone, data.payload, (err) => {
               if(err) {
                callback(400, { message: "could not register user" });
               }
               else {
                   callback(200, {message: "user registered successfully"})
               }
            })   
        }
    }
    return {
        post: createUser
    }
})()

module.exports = userHandler