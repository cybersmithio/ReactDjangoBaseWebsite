import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";
import jwt_decode from "jwt-decode";

test("Local storage is being set by user context", async () => {
  render(<App />);

  const loginLink = await screen.findByRole("link", { name: /login/i });
  userEvent.click(loginLink);

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();
  const passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();
  const loginButton = await screen.findByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.com");
  expect(loginButton).toBeDisabled();
  userEvent.clear(passwordField);
  userEvent.type(passwordField, "LetMeIn1234!");
  userEvent.click(loginButton);

  const userProfileLink = await screen.findByRole("link", {
    name: /James Smith/i,
  });
  expect(userProfileLink).toBeInTheDocument();

  const localUserDetails = JSON.parse(localStorage.getItem("userDetails"));
  expect(localUserDetails.access).not.toBeFalsy();
  const accessTokenDecoded = jwt_decode(localUserDetails.access);
  expect(accessTokenDecoded.name).toBe("James Smith");

  expect(
    screen.queryByRole("link", { name: /login/i })
  ).not.toBeInTheDocument();

  const homepageText = await screen.findByText(/Welcome to the HomePage/i);
  expect(homepageText).toBeInTheDocument();
});

test("Local storage is being read by user context", async () => {
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

  render(<App />);

  const userProfileLink = await screen.findByRole("link", {
    name: /James Smith/i,
  });
  expect(userProfileLink).toBeInTheDocument();

  expect(
    screen.queryByRole("link", { name: /login/i })
  ).not.toBeInTheDocument();
});
