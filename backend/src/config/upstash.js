import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";

dotenv.config();

const redis = Redis.fromEnv();

// 100 requests per minute, counted per visitor rather than site-wide
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  prefix: "thinkboard:api",
});

// handing out an identity is rare, and unlimited ones would fill the database,
// so this one is counted per ip and kept deliberately tight
export const ownerRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 m"),
  prefix: "thinkboard:owner",
});
