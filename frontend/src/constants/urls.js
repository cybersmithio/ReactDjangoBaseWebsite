export const BACKEND_URL =
  "_env_" in window ? window._env_.BACKEND_URL : "http://localhost:8000/";

export const REGISTRATION_ENDPOINT = BACKEND_URL + "api/users/register/";
