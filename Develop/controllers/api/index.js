const router = require("express").Router();
const {Post, User, Comment} = require('../../models');

// login
router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

router.get("/", async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{
                model: User,
                attributes: ["name"]
            }]
        });

        const posts = postData.map((post) =>
            post.get({ plain: true })
        );

        res.render("homepage", {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.error(err);  // log error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;