import {
  screen,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../LoginPage";
import { LOGIN_ENDPOINT } from "../../../constants/urls";
import { server } from "../../../tests/server";
import { rest } from "msw";
import { UserDetailsProvider } from "../../../context/UserContext";
import { BrowserRouter } from "react-router-dom";

test("Login page shows loading message after clicking register", async () => {
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  server.resetHandlers(
    rest.post(LOGIN_ENDPOINT, async (req, res, ctx) => {
      await _sleep(2000);
      return res(ctx.status(500));
    })
  );

  render(
    <BrowserRouter>
      <UserDetailsProvider>
        <LoginPage />
      </UserDetailsProvider>
    </BrowserRouter>
  );

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
  userEvent.clear(passwordField);
  userEvent.type(passwordField, "WrongPassword!");
  userEvent.click(loginButton);

  const loadingMessage = await screen.findByText(/Loading/i);
  expect(loadingMessage).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 5000,
  });

  const errorSigningIn = await screen.findByText(/Error Logging In/i);
  expect(errorSigningIn).toBeInTheDocument();
});
