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
  userEvent.clear(registerPassword);
  userEvent.type(registerPassword, "MyNewPassword123!");
  userEvent.clear(confirmPassword);
  userEvent.type(confirmPassword, "MyNewPassword123!");

  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "j");
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "james@example");
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "james@example.");
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "@example.com");
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "james@example.com");
  expect(submitButton).toBeEnabled();

  userEvent.clear(registerEmail);
  expect(submitButton).toBeDisabled();
  userEvent.type(registerEmail, '"James Smith"@example.com');
  expect(submitButton).toBeEnabled();
});
