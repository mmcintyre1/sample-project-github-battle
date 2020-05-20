import React from "react";

export default function SubmitButton({ text, handleClick }) {
  console.log(handleClick);
  return (
    <button className="animated-border-button btn btn-space" onClick={handleClick}>
      {text}
    </button>
  );
}
