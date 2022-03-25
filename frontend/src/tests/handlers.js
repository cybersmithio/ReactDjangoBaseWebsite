import { rest } from "msw";
import { REGISTRATION_ENDPOINT } from "../constants/urls";

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
];
