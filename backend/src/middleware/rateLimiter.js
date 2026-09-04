import { apiRatelimit, ownerRatelimit } from "../config/upstash.js";

// one bucket per key instead of one bucket for the whole site, so a single
// busy visitor can no longer spend everybody else's budget
function limitBy(ratelimit, keyOf) {
  return async (req, res, next) => {
    try {
      const { success } = await ratelimit.limit(keyOf(req));

      if (!success) {
        return res.status(429).json({
          message: "Too many requests, please try again later",
        });
      }

      next();
    } catch (error) {
      console.log("Rate limit error", error);
      next(error);
    }
  };
}

// the owner id is the visitor; before one is issued, fall back to the address
export const apiRateLimiter = limitBy(
  apiRatelimit,
  (req) => req.headers["x-owner-id"] || req.ip,
);

// keyed on the address only: the whole point is to bound how many identities
// one machine can create, and the header would be trivial to rotate
export const ownerRateLimiter = limitBy(ownerRatelimit, (req) => req.ip);
