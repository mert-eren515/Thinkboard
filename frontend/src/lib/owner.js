import axios from "axios";

import { BASE_URL } from "./config.js";

const STORAGE_KEY = "thinkboard-owner-id";

// holds the in-flight request so two calls on a fresh browser
// don't end up asking for two separate ids
let pendingRequest = null;

// private mode and blocked site data make localStorage throw, so keep a copy
// that at least survives until the page is closed
let fallbackId = null;

function readStoredId() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return fallbackId;
  }
}

function storeId(ownerId) {
  fallbackId = ownerId;

  try {
    localStorage.setItem(STORAGE_KEY, ownerId);
  } catch {
    // nothing to do: the id lives in memory for this page load only
  }
}

// note that this uses the bare axios, not our api instance: going through
// the instance would run the interceptor, which would call this again
function requestOwnerId() {
  return axios
    .post(`${BASE_URL}/owners`)
    .then((res) => {
      const ownerId = res.data.ownerId;
      storeId(ownerId);
      return ownerId;
    })
    .finally(() => {
      // cleared on failure too, otherwise one outage would leave every later
      // call stuck on the same rejected request until a reload
      pendingRequest = null;
    });
}

// the id every note is tied to: same browser = same notes
export async function getOwnerId() {
  const savedId = readStoredId();
  if (savedId) return savedId;

  if (!pendingRequest) pendingRequest = requestOwnerId();

  return pendingRequest;
}

// used when the server rejects the id we hold: drop it and start over.
// takes the id that was rejected, so that when several requests fail at once
// only the first one clears and the rest join its replacement request
export function forgetOwnerId(rejectedId) {
  if (rejectedId && readStoredId() !== rejectedId) return;

  fallbackId = null;
  pendingRequest = null;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // as far as we're concerned it's already gone
  }
}
