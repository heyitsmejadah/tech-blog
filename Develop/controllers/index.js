const router = require('express').Router();

const apiRoutes = require("./api");
const homeRoutes = require("./homeroutes.js");
const dashboardRoutes = require("./dashboard.js")

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;