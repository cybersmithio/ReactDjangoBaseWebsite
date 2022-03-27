import {
  screen,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { VERIFY_EMAIL_ENDPOINT } from "../../../constants/urls";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "../../../App";
import { rest } from "msw";
import { server } from "../../../tests/server";

test("The verification link sends a request to backend and is successful", async () => {
  const history = createBrowserHistory();
  history.push("/verifyEmail/12345678901234567890123456789012");

  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const successMessage = await screen.findByRole("heading", {
    name: /email verified/i,
  });
  expect(successMessage).toBeInTheDocument();

  const loginLink = await screen.findByRole("link", { name: /log in/i });
  expect(loginLink).toBeInTheDocument();
});

test("The verification page displays error", async () => {
  const history = createBrowserHistory();
  history.push("/verifyEmail/BadVerificationSecret");

  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const errorMessage = await screen.findByRole("heading", {
    name: /Unable To Verify Email/i,
  });
  expect(errorMessage).toBeInTheDocument();
});

test("The verification page displays loading", async () => {
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  server.resetHandlers(
    rest.post(VERIFY_EMAIL_ENDPOINT, async (req, res, ctx) => {
      await _sleep(2000);
      return res(ctx.status(500));
    })
  );

  const history = createBrowserHistory();
  history.push("/verifyEmail/BadVerificationSecret");

  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const loadingMessage = await screen.findByText(/loading/i);
  expect(loadingMessage).toBeInTheDocument();

  // Because we are delaying the response so long (2 seconds),
  // we need to wait for loading to be removed
  // or it will assume things went wrong.
  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 5000,
  });

  const errorMessage = await screen.findByRole("heading", {
    name: /Unable To Verify Email/i,
  });
  expect(errorMessage).toBeInTheDocument();
});
