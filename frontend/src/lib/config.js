// in production, there's no localhost so we have to make this dynamic
export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
