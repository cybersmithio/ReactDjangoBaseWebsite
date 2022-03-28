import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";

test("User can see existing profile information", async () => {
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
  expect(updateButton).toBeEnabled();

  //Check the form data
  expect(nameField.value).toBe("James Smith");
  expect(updatePasswordField.value).toBe("");
  expect(confirmPasswordField.value).toBe("");
});
