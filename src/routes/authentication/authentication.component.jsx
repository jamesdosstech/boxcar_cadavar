import "./authentication.styles.scss";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import SignUpForm from "./sign-up-form/sign-up-form.component";
import SignInForm from "./sign-in-form/sign-in-form.component";
import Button from "../../components/button/button.component";

import { UserContext } from "../../context/user/user.context";

const Authentication = () => {
  const { currentUser } = useContext(UserContext);
  const [isNewUser, setIsNewUser] = useState(false);

  const toggleUserMode = () => {
    setIsNewUser((prevMode) => !prevMode);
  };

  return (
    <div className="authentication-container">
      {currentUser ? (
        <div className="authentication-logged-in">
          <div aria-live="polite" className="logged-in-message">
            You are successfully logged in.
          </div>
          <Link to="/" className="back-link">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="authentication-forms">
          <div className="authentication-toggle">
            {isNewUser ? (
              <>
                <p>Already a user? Sign in here:</p>
                <Button onClick={toggleUserMode}>Sign In</Button>
              </>
            ) : (
              <>
                <p>New user? Sign up here:</p>
                <Button onClick={toggleUserMode}>Sign Up</Button>
              </>
            )}
          </div>
          {isNewUser ? <SignUpForm /> : <SignInForm />}
        </div>
      )}
    </div>
  );
};

export default Authentication;
