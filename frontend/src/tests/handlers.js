import { rest } from "msw";
import {
  REGISTRATION_ENDPOINT,
  VERIFY_EMAIL_ENDPOINT,
  LOGIN_ENDPOINT,
  PROFILE_UPDATE_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
} from "../constants/urls";

export const handlers = [
  rest.post(REGISTRATION_ENDPOINT, (req, res, ctx) => {
    if (
      req.body.name === "James Smith" &&
      req.body.email === "james@example.com" &&
      req.body.password === "LetMeIn1234!"
    ) {
      return res(ctx.json({ message: "successful" }));
    }
    return res(ctx.status(500));
  }),
  rest.post(VERIFY_EMAIL_ENDPOINT, (req, res, ctx) => {
    if (req.body.verification_secret === "12345678901234567890123456789012") {
      return res(ctx.status(200));
    }
    return res(ctx.status(500));
  }),

  rest.post(LOGIN_ENDPOINT, (req, res, ctx) => {
    if (
      req.body.email === "james@example.com" &&
      req.body.password === "LetMeIn1234!"
    ) {
      const sign = require("jwt-encode");
      var accessToken = sign(
        {
          token_type: "access",
          exp: "9999999999",
          jti: "1234567898396572",
          user_id: 1,
          name: "James Smith",
        },
        "mysecret"
      );
      return res(
        ctx.json({ access: accessToken, refresh: "abcdefghijklmnop" })
      );
    }

    return res(ctx.status(500));
  }),

  rest.put(PROFILE_UPDATE_ENDPOINT, (req, res, ctx) => {
    if (
      req.body.name === "Mr James S. Smith" ||
      req.body.password === "IWantIn123!"
    ) {
      const sign = require("jwt-encode");
      return res(
        ctx.json({
          access: sign(
            {
              token_type: "access",
              exp: "9999999999",
              jti: "1234567898396572",
              user_id: 1,
              name: req.body.name,
            },
            "mysecret"
          ),
          refresh: sign(
            {
              token_type: "refresh",
              exp: "9999999999",
              jti: "1234567898396572",
              user_id: 1,
              name: req.body.name,
            },
            "mysecret"
          ),
        })
      );
    } else {
      return res(ctx.status(500));
    }
  }),
  rest.post(FORGOT_PASSWORD_ENDPOINT, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
