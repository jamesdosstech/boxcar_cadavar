import styled, { css } from "styled-components";

const subColor = "hotpink";
const mainColor = "black";
const bgColor = "black";

const shrinkLabelStyle = css`
  top: -14px;
  font-size: 12px;
  color: ${mainColor};
  background-color: ${bgColor};
`;

export const FormInputLabel = styled.label`
  color: ${subColor};
  background-color: ${bgColor};
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: top 0.3s ease, font-size 0.3s ease;

  ${({ shrink }) => shrink && shrinkLabelStyle};
`;

export const Input = styled.input`
  background-color: ${bgColor};
  color: ${subColor};
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${subColor};
  margin: 25px 0;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-bottom: 2px solid ${mainColor};
  }

  &:focus ~ ${FormInputLabel} {
    ${shrinkLabelStyle};
  }
`;

export const Group = styled.div`
  position: relative;
  margin: 45px 0;
  display: flex;
  flex-direction: column;

  input[type="password"] {
    letter-spacing: 0.3em;
  }

  /* Responsive Adjustments */
  @media screen and (max-width: 768px) {
    margin: 30px 0;
  }
`;

const formInputStyles = `
  width: 100%;
  padding: 10px 0;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  .sign-up-header {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }

  .buttons-container {
    text-align: center;
    margin-top: 20px;
  }
`;

