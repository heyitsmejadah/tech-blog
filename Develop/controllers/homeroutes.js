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
// get all posts
router.get('/', async (req, res) => {
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
router.get('/post/:id', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        try {
            const postData = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ['name']
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ['name']
                        }
                    },
                ],
            });

            if (postData) {
                const post = postData.get({ plain: true });

                res.render('viewpost', {
                    post,
                    loggedIn: req.session.loggedIn
                });
            } else {
                res.status(404).json({ error: 'Post not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// get all posts for a user
router.get('/profile', async (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        try {
            const postData = await Post.findAll({
                where: {
                    user_id: req.session.user_id
                },
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            });

            const posts = postData.map((post) =>
                post.get({ plain: true })
            );

            res.render('dashboard', {
                posts,
                loggedIn: req.session.loggedIn
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// create a new post
router.post("/post", async (req, res) => {
    try {
        const postData = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });
        const post = postData.get({ plain: true });
        if (postData) {
            res.status(201).json({ id: post.id });
        } else {
            res.status(500).json({ message: "Error creating post" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// update a specific post
router.put("/post/:id", async (req, res) => {
    try {
        const postData = await Post.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        if (postData) {
            res.status(200).json({ message: "Post updated" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// delete a specific post
router.delete('/post/:id', async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id
            }
        });
        if (postData) {
            res.status(200).json({ message: "Post deleted" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json(err);
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