import { screen, render } from "@testing-library/react";
import ResetPasswordPage from "../ResetPasswordPage";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import App from "../../../App";

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

test("Reset password page sends a request to backend", async () => {
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

  const msgAboutEmail = await screen.findByText(
    /your password has been reset/i
  );
  expect(msgAboutEmail).toBeInTheDocument();
  const loginLink = await screen.findByRole("link", { name: /log in/i });
  expect(loginLink).toBeInTheDocument();
  userEvent.click(loginLink);
  const loginButton = await screen.findByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});
