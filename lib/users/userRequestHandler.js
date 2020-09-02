const fileUtil = require("../fileUtil")
const path = require("path")
const fs = require("fs")
const requestHandler = (function() {

    function borrowABook(data, callback) {
        const { userId,  bookId} = data.query
        console.log(userId, bookId);
        let userPath = path.join(fileUtil.baseDir, "users/", userId + ".json")
        let bookPath = path.join(fileUtil.baseDir, "books/", bookId + ".json")

        fs.exists(userPath, (userExist) => {
            let destPath = path.join(fileUtil.baseDir, "rented/", bookId + ".json")
            if(!userExist) callback(401, {error: "Unauthorized user"})
            else {
                fs.exists(bookPath, (bookExist) => {
                    if(!bookExist) callback(404, {message: "requested book is unavailable"})
                    else {
                        fs.copyFile(bookPath, destPath, (err) => {
                            if(err) console.log(err.message);
                            fileUtil.delete("books", bookId, (err) => {
                                if(!err) console.log("rent successful")
                            })
                        })
                        callback(200, {message: "book rented successfully"})
                    }
                })
            }
        })
    }
    function returnABook(data, callback) {
        const { userId,  bookId} = data.query
        console.log(userId, bookId);
        let userPath = path.join(fileUtil.baseDir, "users/", userId + ".json")
        let bookPath = path.join(fileUtil.baseDir, "rented/", bookId + ".json")

        fs.exists(userPath, (userExist) => {
            let destPath = path.join(fileUtil.baseDir, "books/", bookId + ".json")
            if(!userExist) callback(401, {error: "Unauthorized user"})
            else {
                fs.exists(bookPath, (bookExist) => {
                    if(!bookExist) callback(404, {message: "book does not exist"})
                    else {
                        fs.copyFile(bookPath, destPath, (err) => {
                            if(err) console.log(err.message);
                            fileUtil.delete("rented", bookId, (err) => {
                                if(!err) console.log("return successful")
                            })
                        })
                        callback(200, {message: "book returned successfully"})
                    }
                })
            }
        })
    }
    return {
        get: borrowABook,
        post: returnABook
    }
})()

module.exports = requestHandler