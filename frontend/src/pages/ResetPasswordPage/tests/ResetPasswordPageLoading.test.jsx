import {
  screen,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";
import { RESET_PASSWORD_ENDPOINT } from "../../../constants/urls";
import { server } from "../../../tests/server";
import { rest } from "msw";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

test("Profile page shows loading when updating", async () => {
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  server.resetHandlers(
    rest.post(RESET_PASSWORD_ENDPOINT, async (req, res, ctx) => {
      await _sleep(2000);
      return res(ctx.status(500));
    })
  );

  localStorage.clear();
  const history = createBrowserHistory();
  history.push("/resetPassword/12345678901234567890123456789012");

  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const password = await screen.findByLabelText(/^password/i);
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  const resetButton = await screen.findByRole("button", {
    name: /reset password/i,
  });

  userEvent.clear(password);
  userEvent.type(password, "MyNewPassword123!");
  expect(resetButton).toBeDisabled();

  userEvent.clear(confirmPassword);
  userEvent.type(confirmPassword, "MyNewPassword123!");
  expect(resetButton).toBeEnabled();

  userEvent.click(resetButton);

  const loadingMessage = await screen.findByText(/Loading/i);
  expect(loadingMessage).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 5000,
  });

  const msgAboutEmail = await screen.findByText(
    /An error occurred resetting the password/i
  );
  expect(msgAboutEmail).toBeInTheDocument();
});
