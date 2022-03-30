import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordPage from "../ResetPasswordPage";

test("Reset password page checks for password complexity", async () => {
  localStorage.clear();
  render(<ResetPasswordPage />);

  const resetPassword = await screen.findByLabelText(/^password/i);
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  const resetButton = await screen.findByRole("button", {
    name: /reset password/i,
  });

  expect(resetButton).toBeInTheDocument();

  var passwordGood = screen.queryByText(/Password complexity is good/i);
  var needUsercase = screen.queryByText(/1 uppercase letter/i);
  var needNumber = screen.queryByText(/1 number/i);
  var needLowercase = screen.queryByText(/1 lowercase letter/i);
  var needPunc = screen.queryByText(/1 punctuation character/i);
  var needLength = screen.queryByText(/8 characters minimum/i);
  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needLength).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();

  userEvent.clear(resetPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(resetPassword, "p");
  userEvent.type(confirmPassword, "p");
  expect(resetButton).toBeDisabled();

  needUsercase = await screen.findByText(/1 uppercase letter/i);
  needNumber = await screen.findByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = await screen.findByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);
  expect(needUsercase).toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();
  passwordGood = screen.queryByText(/Password complexity is good/i);
  expect(passwordGood).not.toBeInTheDocument();

  userEvent.type(resetPassword, "A");
  userEvent.type(confirmPassword, "A");
  expect(resetButton).toBeDisabled();

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = await screen.findByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = await screen.findByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();
  passwordGood = screen.queryByText(/Password complexity is good/i);
  expect(passwordGood).not.toBeInTheDocument();

  userEvent.clear(resetPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(resetPassword, "Pass!");
  userEvent.type(confirmPassword, "Pass!");
  expect(resetButton).toBeDisabled();

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = await screen.findByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(needLength).toBeInTheDocument();
  passwordGood = screen.queryByText(/Password complexity is good/i);
  expect(passwordGood).not.toBeInTheDocument();

  userEvent.clear(resetPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(resetPassword, "P4ss!");
  userEvent.type(confirmPassword, "P4ss!");
  expect(resetButton).toBeDisabled();

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = screen.queryByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(needLength).toBeInTheDocument();
  passwordGood = screen.queryByText(/Password complexity is good/i);
  expect(passwordGood).not.toBeInTheDocument();

  userEvent.clear(resetPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(resetPassword, "MyNewPassword123!");
  userEvent.type(confirmPassword, "MyNewPassword123!");
  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = screen.queryByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  needLength = screen.queryByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(needLength).not.toBeInTheDocument();
  passwordGood = await screen.findByText(/Password complexity is good/i);
  expect(passwordGood).toBeInTheDocument();

  expect(resetButton).toBeEnabled();
});
