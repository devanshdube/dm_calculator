const verifyAdminToken = require("./verifyAdminToken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Missing token" });
  }

  const token = authHeader.split(" ")[1];
  const user = await verifyAdminToken(token);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }

  req.user = user;
  next();
};

module.exports = authenticateToken;
