import { screen, render } from "@testing-library/react";
import ForgotPasswordPage from "../ForgotPasswordPage";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { FORGOT_PASSWORD_ENDPOINT } from "../../../constants/urls";
import { rest } from "msw";
import { server } from "../../../tests/server";

test("Forgot password page shows error when backend is not 200 OK", async () => {
  server.resetHandlers(
    rest.post(FORGOT_PASSWORD_ENDPOINT, (req, res, ctx) => res(ctx.status(400)))
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

  const errorMsg = await screen.findByText(
    /There was an error with the request. Please try again later./i
  );
  expect(errorMsg).toBeInTheDocument();
});
