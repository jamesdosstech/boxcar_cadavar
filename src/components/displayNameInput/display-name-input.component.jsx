import { useState, useContext } from "react";
import { UserContext } from "../../context/user/user.context";
import FormInput from "../form-input/form-input.component";
import { auth } from "../../utils/firebase/firebase.utils";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import "./display-name-input.styles.scss";
import Button from "../button/button.component";

const defaultFormFields = {
  displayName: "",
};

const DisplayNameInput = () => {
  const [drop, setDrop] = useState(false);

  const { currentUser } = useContext(UserContext);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName } = formFields;

  //firebase logic
  console.log(auth.currentUser.displayName);

  const toggleChangeName = () => {
    setDrop(!drop);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log("submit");
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    });
  };

  return (
    <>
      <div onClick={toggleChangeName}>{currentUser.displayName}</div>
      {drop ? (
        <div className="absolute-block">
          <form onSubmit={handleSubmit}>
            <FormInput
              type="text"
              label="New Display Name"
              name="displayName"
              value={displayName}
              onChange={handleChange}
              required
              maxLength={15}
            />
            <Button>Submit</Button>
          </form>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DisplayNameInput;
