import { screen, render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "../../../App";

test("The profile page redirects unauthenticated users to the login page", async () => {
  localStorage.clear();
  const history = createBrowserHistory();
  history.push("/profile/");

  render(
    <Router history={history}>
      <App />
    </Router>
  );

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  expect(emailField).toBeInTheDocument();
  const passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();
  const loginButton = await screen.findByRole("button", { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});
