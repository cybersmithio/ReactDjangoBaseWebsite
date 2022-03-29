import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FORGOT_PASSWORD_ENDPOINT } from "../../../constants/urls";
import App from "../../../App";
import { setupServer } from "msw/node";
import { handlers } from "../../../tests/handlers";
import { matchRequestUrl } from "msw";

const server = setupServer(...handlers);

function waitForRequest(method, url) {
  let requestId = "";

  return new Promise((resolve, reject) => {
    server.events.on("request:start", (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase();
      const matchesUrl = matchRequestUrl(req.url, url).matches;
      if (matchesMethod && matchesUrl) {
        requestId = req.id;
      }
    });
    server.events.on("request:match", (req) => {
      if (req.id === requestId) {
        resolve(req);
      }
    });
    server.events.on("request:unhandled", (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`)
        );
      }
    });
  });
}

test("Forgot password page sends request to backend", async () => {
  localStorage.clear();
  render(<App />);

  const loginLink = await screen.findByRole("link", { name: /login/i });
  expect(loginLink).toBeInTheDocument();
  userEvent.click(loginLink);

  const forgotLink = await screen.findByRole("link", {
    name: /forgot password/i,
  });
  expect(forgotLink).toBeInTheDocument();
  userEvent.click(forgotLink);

  const emailField = await screen.findByRole("textbox", {
    name: /email address/i,
  });
  const resetButton = await screen.findByRole("button", {
    name: /Reset Password/i,
  });

  userEvent.clear(emailField);
  userEvent.type(emailField, "james@example.com");

  const pendingRequest = waitForRequest("POST", FORGOT_PASSWORD_ENDPOINT);

  userEvent.click(resetButton);

  const request = await pendingRequest;
  expect(request.body).toEqual({
    email: "james@example.com",
  });

  const msgAboutEmail = await screen.findByText(
    /if your email is found, we will send you a link to reset your password/i
  );
  expect(msgAboutEmail).toBeInTheDocument();
});
