import "./authentication.styles.scss";

import { Link } from "react-router-dom";

import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";

import Splash from "../../routes/splash/splash.component";

import { UserContext } from "../../context/user/user.context";
import { useContext, useState } from "react";
import Button from "../../components/button/button.component";

const Authentication = () => {
  const { currentUser } = useContext(UserContext);
  const [isNewUser, setIsNewUser] = useState(false);

  const onSignUpChange = () => {
    setIsNewUser(!isNewUser)
  }
  // const date = new Date();
  // const dateCopy = new Date(date.getTime());
  // const nextFriday = new Date(
  //     dateCopy.setDate(
  //     dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7),
  //     dateCopy.setHours(0),
  //     dateCopy.setMinutes(0),
  //     dateCopy.setSeconds(0)
  //     )
  // );

  // const actualNextFriday = nextFriday.getTime();

  // const timeAfterThreeDays = actualNextFriday;
  return (
    <>
      {currentUser ? (
        <div className="authentication-container">
          <div style={{color: 'hotpink'}}>You are successfully logged in</div>
          <div>
            <Link to={"/"}>Back</Link>
          </div>
        </div>
      ) : (
        <div
        // className="authentication-container"
        > {
          isNewUser ? (
            <>
            <div style={{color: 'white', textAlign: 'center'}}>
              Are you currently a user? Sign in here.
              <Button onClick={onSignUpChange}>Sign In</Button>
            </div>
            <SignUpForm />
            </>
            
          ) : (
            <>
              <div style={{color: 'white', textAlign: 'center'}}>
                If you are not a current user sign up here.
                <Button onClick={onSignUpChange}>Sign Up</Button>
              </div>
              <SignInForm/> 
            </>
          )
        }
        </div>
      )}
    </>
  );
};

export default Authentication;
