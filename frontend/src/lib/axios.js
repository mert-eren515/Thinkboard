import axios from "axios";

import { BASE_URL } from "./config.js";
import { getOwnerId } from "./owner.js";

const api = axios.create({
  baseURL: BASE_URL,
});

// every request carries the id that owns the notes
api.interceptors.request.use(async (request) => {
  request.headers["X-Owner-Id"] = await getOwnerId();
  return request;
});

export default api;
