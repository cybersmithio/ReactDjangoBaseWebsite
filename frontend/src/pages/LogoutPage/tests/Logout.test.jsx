import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../../App";

test("Log user out", async () => {
  const sign = require("jwt-encode");
  localStorage.setItem(
    "userDetails",
    JSON.stringify({
      access: sign(
        {
          token_type: "access",
          exp: "9999999999",
          jti: "1234567898396572",
          user_id: 1,
          name: "James Smith",
        },
        "mysecret"
      ),
      refresh: sign(
        {
          token_type: "refresh",
          exp: "9999999999",
          jti: "1234567898396872",
          user_id: 1,
          name: "James Smith",
        },
        "mysecret"
      ),
    })
  );

  render(<App />);

  const userProfileLink = await screen.findByRole("link", {
    name: /James Smith/i,
  });
  expect(userProfileLink).toBeInTheDocument();

  expect(
    screen.queryByRole("link", { name: /login/i })
  ).not.toBeInTheDocument();

  const logoutLink = await screen.findByText(/logout/i);
  expect(logoutLink).toBeInTheDocument();
  userEvent.click(logoutLink);
  const logoutText = await screen.findByText(
    /You have been successfully logged out/i
  );
  expect(logoutText).toBeInTheDocument();

  const localUserDetails = JSON.parse(localStorage.getItem("userDetails"));
  expect(localUserDetails).toBeFalsy();

  const loginLink = await screen.findByRole("link", { name: /login/i });
  expect(loginLink).toBeInTheDocument();
});
