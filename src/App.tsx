import React, { useState } from "react";

import Logo from "./logo.png";
import LogoAA from "./logoAA.svg";

export default function App() {
  const [count, setCount]: any = useState(0);
  function incrimet() {
    setCount(count + 1);
  }

  function errors() {
    throw new Error("Error");
  }
  return (
    <div>
      <p className="ssss">incriment : {count}</p>
      <button onClick={incrimet}>clickMe</button>
      <button onClick={errors}>error ss</button>
      <img src={Logo} alt="" />
      <img src={LogoAA} alt="" />
    </div>
  );
}
