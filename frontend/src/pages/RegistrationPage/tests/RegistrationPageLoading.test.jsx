import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationPage from "../RegistrationPage";
import { BrowserRouter } from "react-router-dom";
import { REGISTRATION_ENDPOINT } from "../../../constants/urls";
import { server } from "../../../tests/server";
import { rest } from "msw";

test("Registration page shows loading message after clicking register", async () => {
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  server.resetHandlers(
    rest.post(REGISTRATION_ENDPOINT, async (req, res, ctx) => {
      await _sleep(2000);
      res(ctx.status(500));
    })
  );

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
  userEvent.type(registerEmail, "james@example.com");
  expect(submitButton).toBeEnabled();

  userEvent.click(submitButton);

  const loadingMessage = await screen.findByText(/Loading/i);
  expect(loadingMessage).toBeInTheDocument();
});
