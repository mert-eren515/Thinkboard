import axios from "axios";

import { BASE_URL } from "./config.js";
import { forgetOwnerId, getOwnerId } from "./owner.js";

const api = axios.create({
  baseURL: BASE_URL,
});

// every request carries the id that owns the notes
api.interceptors.request.use(async (request) => {
  request.headers["X-Owner-Id"] = await getOwnerId();
  return request;
});

// a 401 means the server doesn't recognise the id we sent: its database was
// reset, or the id came from a different backend. without this the app would
// keep sending the same dead id forever, so drop it and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (error.response?.status === 401 && request && !request.ownerIdRetried) {
      request.ownerIdRetried = true;
      forgetOwnerId(request.headers["X-Owner-Id"]);
      return api(request);
    }

    return Promise.reject(error);
  },
);

export default api;
