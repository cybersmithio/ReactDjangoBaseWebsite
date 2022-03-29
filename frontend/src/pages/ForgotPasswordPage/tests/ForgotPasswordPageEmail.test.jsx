import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "../ForgotPasswordPage";
import { BrowserRouter } from "react-router-dom";

test("Forgot password page disables and enables submit button when email is check for formatting", async () => {
  render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>
  );

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  const submitButton = await screen.findByRole("button", {
    name: /Reset Password/i,
  });

  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "j");
  expect(submitButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example");
  expect(submitButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.");
  expect(submitButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "@example.com");
  expect(submitButton).toBeDisabled();

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.com");
  expect(submitButton).toBeEnabled();

  userEvent.clear(emailField);
  expect(submitButton).toBeDisabled();
  userEvent.type(emailField, '"James Smith"@example.com');
  expect(submitButton).toBeEnabled();
});
