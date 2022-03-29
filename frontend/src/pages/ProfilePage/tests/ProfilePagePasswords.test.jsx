import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "../ProfilePage";
import { UserDetailsProvider } from "../../../context/UserContext";

test("User sees message if passwords do not match or complexity needs improvement", async () => {
  render(<ProfilePage />, { wrapper: UserDetailsProvider });

  const updatePassword = await screen.findByLabelText(/^update password/i);
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  var submitButton = await screen.findByRole("button", {
    name: /update/i,
  });
  expect(submitButton).toBeInTheDocument();

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

  userEvent.clear(updatePassword);
  userEvent.clear(confirmPassword);
  userEvent.type(updatePassword, "p");
  userEvent.type(confirmPassword, "p");
  expect(submitButton).toBeDisabled();

  needLowercase = screen.queryByText(/1 lowercase letter/i);
  passwordGood = screen.queryByText(/Password complexity is good/i);
  needUsercase = await screen.findByText(/1 uppercase letter/i);
  needNumber = await screen.findByText(/1 number/i);
  needPunc = await screen.findByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);
  expect(needLowercase).not.toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();
  expect(needUsercase).toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needPunc).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();

  userEvent.type(updatePassword, "A");
  userEvent.type(confirmPassword, "A");
  expect(submitButton).toBeDisabled();

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  passwordGood = screen.queryByText(/Password complexity is good/i);
  needNumber = await screen.findByText(/1 number/i);
  needPunc = await screen.findByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needPunc).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();

  userEvent.clear(updatePassword);
  userEvent.clear(confirmPassword);
  userEvent.type(updatePassword, "Pass!");
  userEvent.type(confirmPassword, "Pass!");
  expect(submitButton).toBeDisabled();

  passwordGood = screen.queryByText(/Password complexity is good/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = await screen.findByText(/1 number/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();

  userEvent.clear(updatePassword);
  userEvent.clear(confirmPassword);
  userEvent.type(updatePassword, "P4ss!");
  userEvent.type(confirmPassword, "P4ss!");
  expect(submitButton).toBeDisabled();

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = screen.queryByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  passwordGood = screen.queryByText(/Password complexity is good/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();
  expect(needLength).toBeInTheDocument();

  userEvent.clear(updatePassword);
  userEvent.clear(confirmPassword);
  userEvent.type(updatePassword, "MyNewPassword123!");
  userEvent.type(confirmPassword, "MyNewPassword123!");
  await new Promise((r) => setTimeout(r, 1000));
  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = screen.queryByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  needLength = screen.queryByText(/8 characters minimum/i);
  passwordGood = await screen.findByText(/Password complexity is good/i);
  submitButton = await screen.findByRole("button", {
    name: /update/i,
  });
  expect(submitButton).toBeInTheDocument();

  expect(needUsercase).not.toBeInTheDocument();
  expect(needNumber).not.toBeInTheDocument();
  expect(needLowercase).not.toBeInTheDocument();
  expect(needPunc).not.toBeInTheDocument();
  expect(needLength).not.toBeInTheDocument();
  expect(passwordGood).toBeInTheDocument();
  expect(submitButton).toBeEnabled();
});
