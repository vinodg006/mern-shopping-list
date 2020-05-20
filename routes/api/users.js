const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//Item Model
const User = require("../../models/User");

//@route    POST api/users
//@desc     Register new Users
//@access   Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  //Simple validation
  if (!name || !email || !password) {
    return res.status(404).json({ msg: "Please enter all the fields" });
  }

  //Check for exisiting user
  User.findOne({ email }).then((user) => {
    if (user) return res.status(404).json({ msg: "User already exists" });

    const newUser = new User({
      name,
      email,
      password,
    });

    //Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  name: user.name,
                  id: user.id,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
