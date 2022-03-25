import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("Happy path test", async () => {
  render(<App />);
  const copyrightText = await screen.findByText(/copyright/i);
  expect(copyrightText).toBeInTheDocument();

  const loginLink = await screen.findByRole("link", { name: /login/i });
  expect(loginLink).toBeInTheDocument();
  userEvent.click(loginLink);

  const signInText = await screen.findByRole("heading", { name: /sign in/i });
  expect(signInText).toBeInTheDocument();

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();

  const passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();

  const signInButton = await screen.findByRole("button", { name: /sign in/i });
  expect(signInButton).toBeInTheDocument();
  expect(signInButton).toBeDisabled();

  const registerLink = await screen.findByRole("link", { name: /register/i });
  expect(registerLink).toBeInTheDocument();
  userEvent.click(registerLink);

  const registerHeader = await screen.findByRole("heading", {
    name: /register/i,
  });
  expect(registerHeader).toBeInTheDocument();

  const registerName = await screen.findByRole("textbox", { name: /name/i });
  expect(registerName).toBeInTheDocument();

  const registerEmail = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(registerEmail).toBeInTheDocument();

  const registerPassword = await screen.findByLabelText(/enter password/i);
  expect(registerPassword).toBeInTheDocument();

  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  expect(confirmPassword).toBeInTheDocument();

  const signInLink = await screen.findByRole("link", { name: /sign in/i });
  expect(signInLink).toBeInTheDocument();

  const registerButton = await screen.findByRole("button", {
    name: /register/i,
  });
  expect(registerButton).toBeInTheDocument();
  expect(registerButton).toBeDisabled();

  userEvent.clear(registerName);
  userEvent.type(registerName, "James Smith");
  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "james@example.com");
  userEvent.clear(registerPassword);
  userEvent.type(registerPassword, "LetMeIn1234!");
  userEvent.clear(confirmPassword);
  userEvent.type(confirmPassword, "LetMeIn1234!");
  expect(registerButton).toBeEnabled();
});
