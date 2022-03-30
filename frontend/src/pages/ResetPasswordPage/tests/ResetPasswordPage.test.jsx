import { screen, render } from "@testing-library/react";
import ResetPasswordPage from "../ResetPasswordPage";

test("Reset password page displays as expected", async () => {
  localStorage.clear();

  render(<ResetPasswordPage />);

  const resetPassword = await screen.findByLabelText(/^password/i);
  expect(resetPassword).toBeInTheDocument();
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  expect(confirmPassword).toBeInTheDocument();
  const resetButton = await screen.findByRole("button", {
    name: /reset password/i,
  });
  expect(resetButton).toBeInTheDocument();
  expect(resetButton).toBeDisabled();
});
