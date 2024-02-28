import React, { useContext, useState } from "react";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import { DisplayNameContext } from "../../context/displayName/DisplayName.context";

const UserNameSignIn = () => {
  const useDisplayName = () => useContext(DisplayNameContext);

  const { setDisplayName } = useDisplayName();
  const [localDisplayName, setLocalDisplayName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const displayName = formData.get("displayName");
    setDisplayName(localDisplayName.trim());
    // You can perform additional actions with displayName if needed
  };

  const handleInputChange = (e) => {
    setLocalDisplayName(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="sign-in-header">Login</div>
        <div>
          <FormInput
            label="displayName"
            value={localDisplayName}
            onChange={handleInputChange}
          />
        </div>
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
        </div>
      </form>
    </div>
  );
};

export default UserNameSignIn;
