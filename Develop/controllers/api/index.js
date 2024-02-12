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

// signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user in the database
        const newUser = await User.create({
            username,
            email,
            password
        });

        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
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