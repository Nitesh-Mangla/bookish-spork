const express = require('express')
const router = express.Router();
const bodyParse = require("body-parser")
const {tokenValidate, validateHeader} = require('./Middlewares/TokenVerify')
const {userCreate, userLogin} = require('./Controllers/User')
const {save, getAllAuthor} = require("./Controllers/Author")
const {saveBook, updateBook, byId, inActiveBook, getAll} = require("./Controllers/Book")

router.use(bodyParse.json())

router.post("/sign-up", userCreate)
router.post("/sign-in", userLogin)

router.use('/api/admin', [tokenValidate, validateHeader])

router.post("/api/admin/save-author", save)
router.post("/api/admin/authors", getAllAuthor)
router.post("/api/admin/save-book", saveBook)
router.post("/api/admin/update-book/:id", updateBook)
router.get('/api/admin/book/:id', byId)
router.post("/api/admin/delete/:id", inActiveBook)
router.get("/api/admin/books", getAll)

router.get("*", (req, res) => {
    res.render('404', {
        title: "Page Not Found"
    })
});

module.exports = router;
