const registerCollection = require("../model/registerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// rejex
const emailRejex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRejex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// register
exports.regsiter = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerCollection.findOne({ email: email });
  if (!user) {
    const hashPas = await bcrypt.hash(password, 10);

    let userSignup = new registerCollection({
      name,
      email,
      password: hashPas,
      roll: "user",
    });

    if (userSignup) {
      if (!passwordRejex.test(password) || !emailRejex.test(email)) {
        res.status(200).json("incorrect email or password");
      } else {
        await userSignup.save();
        res.status(200).json("account created successfully");
      }
    }
  } else {
    res.status(200).json("this email is already exist");
  }
};

// login
exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await registerCollection.findOne({ email: email });

  if (user) {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      const id = { id: user._id };
      const token = jwt.sign(id, process.env.JWT_TOCKEN_SECERT);
      res.status(200).json({
        status: "success",
        data: {
          id: user._id,
          email: user.email,
          roll: user.roll,
        },
        token: token,
      });
    } else {
      res.status(200).json({ status: "incorrect password" });
    }
  } else {
    res.status(200).json({ status: "userData not fount" });
  }
};

// update profile
exports.updateProfile = async (req, res) => {

  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    const user = await registerCollection.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    let updatedData = { name, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedUser = await registerCollection.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "failed to update profile" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
};


