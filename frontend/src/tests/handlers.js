import { rest } from "msw";
import {
  REGISTRATION_ENDPOINT,
  VERIFY_EMAIL_ENDPOINT,
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
];
