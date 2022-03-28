import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";

test("User get error message when profile update breaks", async () => {
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
  userEvent.clear(nameField);
  userEvent.type(nameField, "James S. Smith");
  userEvent.clear(updatePasswordField);
  userEvent.type(updatePasswordField, "BadPassword1234!");
  userEvent.clear(confirmPasswordField);
  userEvent.type(confirmPasswordField, "BadPassword1234!");
  userEvent.click(updateButton);

  const updatedNameField = await screen.findByRole("textbox", {
    name: /Full name/i,
    value: /^James Smith$/i,
  });

  expect(updatedNameField).toBeInTheDocument();

  const errorMessage = await screen.findByRole("alert");
  expect(errorMessage).toHaveTextContent(
    "Unable to update profile. Try again later."
  );
});
