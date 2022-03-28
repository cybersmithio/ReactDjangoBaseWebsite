import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";

test("User can log in", async () => {
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
  expect(loginButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.com");
  expect(loginButton).toBeDisabled();
  userEvent.clear(passwordField);
  userEvent.type(passwordField, "LetMeIn1234!");
  expect(loginButton).toBeEnabled();
  userEvent.click(loginButton);

  const userProfileLink = await screen.findByRole("link", {
    name: /James Smith/i,
  });
  expect(userProfileLink).toBeInTheDocument();

  expect(
    screen.queryByRole("link", { name: /login/i })
  ).not.toBeInTheDocument();

  expect(emailField).not.toBeInTheDocument();
  expect(passwordField).not.toBeInTheDocument();
  expect(loginButton).not.toBeInTheDocument();

  const homepageText = await screen.findByText(/Welcome to the HomePage/i);
  expect(homepageText).toBeInTheDocument();
});

test("User cannot log in", async () => {
  render(<App />);

  const loginLink = await screen.findByRole("link", { name: /login/i });
  expect(loginLink).toBeInTheDocument();
  userEvent.click(loginLink);

  var emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();
  var passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();
  var loginButton = await screen.findByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
  expect(loginButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.com");
  userEvent.clear(passwordField);
  userEvent.type(passwordField, "WrongPassword!");
  userEvent.click(loginButton);
  expect(loginButton).toBeEnabled();

  const errorSigningIn = await screen.findByText(/Error Logging In/i);
  expect(errorSigningIn).toBeInTheDocument();

  emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();
  passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();
  loginButton = await screen.findByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});
