import { screen, render } from "@testing-library/react";
import ResetPasswordPage from "../ResetPasswordPage";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

test("Reset password page displays error", async () => {
  localStorage.clear();

  render(<ResetPasswordPage />, { wrapper: BrowserRouter });

  const resetPassword = await screen.findByLabelText(/^password/i);
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  const resetButton = await screen.findByRole("button", {
    name: /reset password/i,
  });
  userEvent.clear(resetPassword);
  userEvent.type(resetPassword, "MyNewPassword123!");

  userEvent.clear(confirmPassword);
  userEvent.type(confirmPassword, "MyNewPassword123!");
  userEvent.click(resetButton);

  const msgAboutEmail = await screen.findByText(
    /An error occurred resetting the password/i
  );
  expect(msgAboutEmail).toBeInTheDocument();

  const loginLink = await screen.findByRole("link", { name: /log in/i });
  expect(loginLink).toBeInTheDocument();
});
