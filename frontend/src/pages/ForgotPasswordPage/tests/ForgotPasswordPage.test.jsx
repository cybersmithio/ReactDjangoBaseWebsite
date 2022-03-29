import { screen, render } from "@testing-library/react";
import ForgotPasswordPage from "../ForgotPasswordPage";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

test("Forgot password page prevents blank emails", async () => {
  render(<ForgotPasswordPage />, { wrapper: BrowserRouter });

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();
  const resetButton = await screen.findByRole("button", {
    name: /Reset Password/i,
  });
  expect(resetButton).toBeInTheDocument();
  expect(resetButton).toBeDisabled();
  const loginLink = await screen.findByRole("link", { name: /login/i });
  expect(loginLink).toBeInTheDocument();
  const registerLink = await screen.findByRole("link", { name: /register/i });
  expect(registerLink).toBeInTheDocument();

  userEvent.clear(emailField);
  expect(resetButton).toBeDisabled();
  userEvent.type(emailField, "james@example.com");
  expect(resetButton).toBeEnabled();
  userEvent.clear(emailField);
  expect(resetButton).toBeDisabled();
});
