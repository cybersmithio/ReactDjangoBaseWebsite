import {
  screen,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";
import { PROFILE_UPDATE_ENDPOINT } from "../../../constants/urls";
import { server } from "../../../tests/server";
import { rest } from "msw";

test("Profile page shows loading when updating", async () => {
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  server.resetHandlers(
    rest.put(PROFILE_UPDATE_ENDPOINT, async (req, res, ctx) => {
      await _sleep(2000);
      return res(ctx.status(500));
    })
  );

  render(<App />);

  //Go to profile
  const userProfileLink = await screen.findByRole("link", {
    name: /James Smith/i,
  });
  userEvent.click(userProfileLink);

  //Check the form structure
  const nameField = await screen.findByRole("textbox", { name: /Full name/i });
  expect(nameField).toBeInTheDocument();
  const updatePasswordField = await screen.findByLabelText(/Update password/i);
  expect(updatePasswordField).toBeInTheDocument();
  const confirmPasswordField = await screen.findByLabelText(
    /Confirm password/i
  );
  expect(confirmPasswordField).toBeInTheDocument();
  const updateButton = await screen.findByRole("button", { name: /update/i });
  expect(updateButton).toBeInTheDocument();

  //Now update
  userEvent.clear(updatePasswordField);
  userEvent.type(updatePasswordField, "BadPassword1234!");
  userEvent.clear(confirmPasswordField);
  userEvent.type(confirmPasswordField, "BadPassword1234!");
  userEvent.click(updateButton);

  const loadingMessage = await screen.findByText(/Loading/i);
  expect(loadingMessage).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 5000,
  });

  const errorMessage = await screen.findByRole("alert");
  expect(errorMessage).toHaveTextContent(
    "Unable to update profile. Try again later."
  );
});
