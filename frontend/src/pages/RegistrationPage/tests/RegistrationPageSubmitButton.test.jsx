import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationPage from "../RegistrationPage";
import { BrowserRouter } from "react-router-dom";

test("Registration page disables and enables submit button when needed", async () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>
  );

  const registerName = await screen.findByRole("textbox", { name: /name/i });
  const registerEmail = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  const registerPassword = await screen.findByLabelText(/enter password/i);
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  const submitButton = await screen.findByRole("button", {
    name: /register/i,
  });
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerName);
  userEvent.type(registerName, "James Smith");
  expect(submitButton).toBeDisabled();
  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "james@example.com");
  expect(submitButton).toBeDisabled();
  userEvent.clear(registerPassword);
  userEvent.type(registerPassword, "MyNewPassword123!");
  expect(submitButton).toBeDisabled();
  userEvent.clear(confirmPassword);
  userEvent.type(confirmPassword, "MyNewPassword123!");
  expect(submitButton).toBeEnabled();

  userEvent.clear(registerName);
  expect(submitButton).toBeDisabled();
  userEvent.type(registerName, "A");
  expect(submitButton).toBeEnabled();

  userEvent.clear(registerEmail);
  expect(submitButton).toBeDisabled();
  userEvent.type(registerEmail, "james@example.com");
  expect(submitButton).toBeEnabled();

  userEvent.clear(registerPassword);
  expect(submitButton).toBeDisabled();
  userEvent.type(registerPassword, "MyNewPassword123!");
  expect(submitButton).toBeEnabled();

  userEvent.clear(confirmPassword);
  expect(submitButton).toBeDisabled();
  userEvent.type(confirmPassword, "MyNewPassword123!");
  expect(submitButton).toBeEnabled();
});
