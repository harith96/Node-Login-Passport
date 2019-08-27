exports.checkRequiredFields = (req, res, next) => {
  req.errors = [];
  const { name, email, password, password2 } = req.body;
  if (!name || !email || !password || !password2) {
    req.errors.push({ msg: "Please fill in all fields" });
  }
  // console.log("checkRequiredFields");
  next();
};
exports.checkPasswordsMatch = (req, res, next) => {
  // req.errors = [];
  const { password, password2 } = req.body;
  if (password != password2) {
    req.errors.push({ msg: `Passwords do not match` });
  }
  // console.log("checkPasswordMatch");
  next();
};

exports.checkPasswordLength = (req, res, next) => {
  // req.errors = [];
  const { password } = req.body;
  const plength = 3;
  if (password.length < plength) {
    req.errors.push({ msg: `Password must be at least ${plength}` });
  }
  // console.log("checkPasswordLength");
  next();
};
