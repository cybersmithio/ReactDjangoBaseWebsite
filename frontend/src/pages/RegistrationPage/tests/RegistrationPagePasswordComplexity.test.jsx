import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationPage from "../RegistrationPage";
import { BrowserRouter } from "react-router-dom";

test("Registration page checks for password complexity", async () => {
  render(
    <BrowserRouter>
      <RegistrationPage />
    </BrowserRouter>
  );

  const registerName = await screen.findByRole("textbox", { name: /name/i });
  const registerEmail = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  userEvent.clear(registerName);
  userEvent.type(registerName, "James Smith");
  userEvent.clear(registerEmail);
  userEvent.type(registerEmail, "james@example.com");

  const registerPassword = await screen.findByLabelText(/enter password/i);
  const confirmPassword = await screen.findByLabelText(/confirm password/i);
  var submitButton = await screen.findByRole("button", {
    name: /register/i,
  });
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toBeDisabled();

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

  userEvent.clear(registerPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(registerPassword, "p");
  userEvent.type(confirmPassword, "p");

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
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerPassword);
  userEvent.clear(confirmPassword);
  passwordGood = screen.queryByText(/Password complexity is good/i);
  needUsercase = await screen.findByText(/1 uppercase letter/i);
  needNumber = await screen.findByText(/1 number/i);
  needLowercase = await screen.findByText(/1 lowercase letter/i);
  needPunc = await screen.findByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);
  expect(needUsercase).toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needLowercase).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();
  expect(needPunc).toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();

  userEvent.type(registerPassword, "A");
  userEvent.type(confirmPassword, "A");
  expect(submitButton).toBeDisabled();

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needLowercase = await screen.findByText(/1 lowercase letter/i);
  passwordGood = screen.queryByText(/Password complexity is good/i);
  needNumber = await screen.findByText(/1 number/i);
  needPunc = await screen.findByText(/1 punctuation character/i);
  needLength = await screen.findByText(/8 characters minimum/i);

  expect(needUsercase).not.toBeInTheDocument();
  expect(needLowercase).toBeInTheDocument();
  expect(passwordGood).not.toBeInTheDocument();
  expect(needNumber).toBeInTheDocument();
  expect(needPunc).toBeInTheDocument();
  expect(needLength).toBeInTheDocument();

  userEvent.clear(registerPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(registerPassword, "Pass!");
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
  expect(submitButton).toBeDisabled();

  userEvent.clear(registerPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(registerPassword, "P4ss!");
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

  userEvent.clear(registerPassword);
  userEvent.clear(confirmPassword);
  userEvent.type(registerPassword, "MyNewPassword123!");
  userEvent.type(confirmPassword, "MyNewPassword123!");

  needUsercase = screen.queryByText(/1 uppercase letter/i);
  needNumber = screen.queryByText(/1 number/i);
  needLowercase = screen.queryByText(/1 lowercase letter/i);
  needPunc = screen.queryByText(/1 punctuation character/i);
  needLength = screen.queryByText(/8 characters minimum/i);
  passwordGood = await screen.findByText(/Password complexity is good/i);
  submitButton = await screen.findByRole("button", {
    name: /register/i,
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
