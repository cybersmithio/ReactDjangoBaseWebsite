import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";
import jwt_decode from "jwt-decode";

test("User can update name and password", async () => {
  render(<App />);

  //Go to profile
  const userProfileLink = await screen.findByRole("link", {
    name: /James Smith/i,
  });
  userEvent.click(userProfileLink);

  //Check the form structure
  const nameField = await screen.findByRole("textbox", { name: /Full name/i });
  const updatePasswordField = await screen.findByLabelText(/Update password/i);
  const confirmPasswordField = await screen.findByLabelText(
    /Confirm password/i
  );
  const updateButton = await screen.findByRole("button", { name: /update/i });

  //Now update
  userEvent.clear(nameField);
  userEvent.type(nameField, "Mr James S. Smith");
  userEvent.clear(updatePasswordField);
  userEvent.type(updatePasswordField, "IWantIn123!");
  userEvent.clear(confirmPasswordField);
  userEvent.type(confirmPasswordField, "IWantIn123!");
  userEvent.click(updateButton);

  //Instead of looking for textbox just by name, and then checking value
  // which seemed to have some glitches, this works better:
  const updatedNameField = await screen.findByRole("textbox", {
    name: /Full name/i,
    value: /^Mr James S. Smith$/i,
  });

  expect(updatedNameField).toBeInTheDocument();

  expect(
    screen.queryByText(/Unable to update profile/i)
  ).not.toBeInTheDocument();

  const updatedUpdatePasswordField = await screen.findByLabelText(
    /Update password/i
  );
  expect(updatedUpdatePasswordField).toBeInTheDocument();

  const localUserDetails = JSON.parse(localStorage.getItem("userDetails"));
  expect(localUserDetails.access).not.toBeFalsy();
  const accessTokenDecoded = jwt_decode(localUserDetails.access);
  expect(accessTokenDecoded.name).toBe("Mr James S. Smith");
});
