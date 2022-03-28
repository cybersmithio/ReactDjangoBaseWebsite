import React, { useEffect } from "react";
import { useUserDetails } from "../../context/UserContext";

function LogoutPage({ history }) {
  const [userDetails, updateUserDetails] = useUserDetails();

  useEffect(() => {
    localStorage.removeItem("userDetails");
    updateUserDetails(false, false);
  }, []);

  return (
    <div>
      <h1>You have been successfully logged out.</h1>
    </div>
  );
}

export default LogoutPage;
