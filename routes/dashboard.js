const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports = router;
