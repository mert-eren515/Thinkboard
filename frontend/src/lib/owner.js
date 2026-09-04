import axios from "axios";

import { BASE_URL } from "./config.js";

const STORAGE_KEY = "thinkboard-owner-id";

// holds the in-flight request so two calls on a fresh browser
// don't end up asking for two separate ids
let pendingRequest = null;

// note that this uses the bare axios, not our api instance: going through
// the instance would run the interceptor, which would call this again
function requestOwnerId() {
  return axios.post(`${BASE_URL}/owners`).then((res) => {
    const ownerId = res.data.ownerId;
    localStorage.setItem(STORAGE_KEY, ownerId);
    pendingRequest = null;
    return ownerId;
  });
}

// the id every note is tied to: same browser = same notes
export async function getOwnerId() {
  const savedId = localStorage.getItem(STORAGE_KEY);
  if (savedId) return savedId;

  if (!pendingRequest) pendingRequest = requestOwnerId();

  return pendingRequest;
}
