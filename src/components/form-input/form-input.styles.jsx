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
  transition: 300ms ease all;

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

  &:focus {
    outline: none;
  }

  &:focus ~ ${FormInputLabel} {
    ${shrinkLabelStyle};
  }
`;
export const Group = styled.div`
  position: relative;
  margin: 45px 0;

  input[type="password"] {
    letter-spacing: 0.3em;
  }
`;
