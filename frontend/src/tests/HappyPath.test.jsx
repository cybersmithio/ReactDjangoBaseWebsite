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

  const loginText = await screen.findByRole("heading", { name: /log in/i });
  expect(loginText).toBeInTheDocument();

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();

  const passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();

  const loginButton = await screen.findByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
  expect(loginButton).toBeDisabled();

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

  const registrationLinkToLogin = await screen.findByRole("link", {
    name: /log in/i,
  });
  expect(registrationLinkToLogin).toBeInTheDocument();

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

  userEvent.click(registerButton);

  //const loadingText = await screen.findByText(/loading/i);
  //expect(loadingText).toBeInTheDocument();

  const verifyEmailText = await screen.findByRole("heading", {
    name: /Verify Email/i,
  });
  expect(verifyEmailText).toBeInTheDocument();

  expect(
    screen.getByText(/A verification email has been sent to james@example.com/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Please click on the link in the email to verify your account/i
    )
  ).toBeInTheDocument();
});
