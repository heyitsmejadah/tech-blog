const router = require('express').Router();
const {Post, User, Comment} = require('../models');

// login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});
// signup
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

// get all posts
router.get('/', async (req, res) => {
    console.log("i am getting all posts");
    try {
        const postData = await Post.findAll({
            include: [{
                model: User,
                attributes: ['name']
            }]
        });

        const posts = postData.map((post) =>
            post.get({ plain: true })
        );

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get one post
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


router.post("/api/users", async (req, res) => {
    try {
        const {name, password} = req.body;
        const userDetails = await User.create({
            name, password
        });
        console.log(userDetails);
        console.log("i am handling api/users?? got em",req.body);
        req.session.loggedIn = true;
    } catch (e) {
        console.log("lol error??", e);
    }
});
module.exports = router;