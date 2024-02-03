const router = require("express").Router();
const {Post, User, Comment} = require("../models");

// login
router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

// return all posts
router.get("/", async (req,res) => {
    try {
        const postData = await Post.findAll ({
            include: [{
                model: User,
                attributes: ["name"]
            }]
        });

        const posts = postData.map((post) =>
        post.get({plain: true})
        );

        res.render("homepage", {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// return one post
router.get("/post/:id", async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        try {
            const postData = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ["name"]
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ["name"]
                        }
                    },
                ],
            });

            if (postData) {
                const post = postData.get({plain: true});
                res.render("viewpost", {
                    loggedIn: req.session.loggedIn
                });
            } else {
                res.status(404)
            }
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
});

module.exports = router;