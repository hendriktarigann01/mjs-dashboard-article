const jwt = require("jsonwebtoken");

const USERNAME = process.env.ENV_USER;
const PASSWORD = process.env.ENV_PASS;

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  }

  return res.status(401).json({ message: "Username Atau Password Salah" });
};

const logout = (req, res) => {
  return res.json({
    message:
      "Successfully logged out. Please delete your token on client side.",
  });
};

module.exports = {
  login,
  logout,
};
