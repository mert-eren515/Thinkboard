import crypto from "crypto";

import Owner from "../models/Owner.js";

const MAX_ATTEMPTS = 100;
const DUPLICATE_KEY = 11000; // mongo's "this _id already exists" error code

export async function createOwner(_, res) {
  try {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const ownerId = crypto.randomUUID();

      try {
        await Owner.create({ _id: ownerId });
        return res.status(201).json({ ownerId });
      } catch (error) {
        // the id was taken, so draw another one and try again
        if (error.code === DUPLICATE_KEY) continue;
        throw error;
      }
    }

    console.error(`Could not allocate an owner id in ${MAX_ATTEMPTS} attempts`);
    res.status(500).json({ message: "Internal server error" });
  } catch (error) {
    console.error("Error in createOwner controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
