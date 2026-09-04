import Owner from "../models/Owner.js";

// checks that the id on the request is one the server actually issued,
// then puts it on req so every controller can scope its query to that owner
const identifyOwner = async (req, res, next) => {
  try {
    const ownerId = req.headers["x-owner-id"];

    if (!ownerId) {
      return res.status(400).json({ message: "Missing owner id" });
    }

    const exists = await Owner.exists({ _id: ownerId });
    if (!exists) {
      return res.status(401).json({ message: "Unknown owner id" });
    }

    req.ownerId = ownerId;
    next();
  } catch (error) {
    console.error("Error in identifyOwner middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default identifyOwner;
