// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { server } from "./tests/server.js";

beforeAll(() => server.listen());

beforeEach(() => {
  const sign = require("jwt-encode");
  localStorage.setItem(
    "userDetails",
    JSON.stringify({
      access: sign(
        {
          token_type: "access",
          exp: "9999999999",
          jti: "1234567898396572",
          user_id: 1,
          name: "James Smith",
        },
        "mysecret"
      ),
      refresh: sign(
        {
          token_type: "refresh",
          exp: "9999999999",
          jti: "1234567898396872",
          user_id: 1,
          name: "James Smith",
        },
        "mysecret"
      ),
    })
  );
});

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});

afterAll(() => server.close());
