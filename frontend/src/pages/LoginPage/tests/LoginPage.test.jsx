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
