import {
  screen,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "../ForgotPasswordPage";
import { BrowserRouter } from "react-router-dom";
import { FORGOT_PASSWORD_ENDPOINT } from "../../../constants/urls";
import { server } from "../../../tests/server";
import { rest } from "msw";

test("Forgot password page shows loading when updating", async () => {
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  server.resetHandlers(
    rest.post(FORGOT_PASSWORD_ENDPOINT, async (req, res, ctx) => {
      await _sleep(2000);
      return res(ctx.status(500));
    })
  );

  render(<ForgotPasswordPage />, { wrapper: BrowserRouter });

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  const resetButton = await screen.findByRole("button", {
    name: /Reset Password/i,
  });

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.com");
  userEvent.click(resetButton);

  const loadingMessage = await screen.findByText(/Loading/i);
  expect(loadingMessage).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 5000,
  });

  const errorMsg = await screen.findByText(
    /There was an error with the request. Please try again later./i
  );
  expect(errorMsg).toBeInTheDocument();
});
