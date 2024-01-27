import { useState } from "react";

const Toggleable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisable = { display: visible ? "none" : "" };
  const showWhenVisable = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <div style={hideWhenVisable}>
        <button onClick={toggleVisibility}>{props.buttonLable}</button>
      </div>
      <div style={showWhenVisable}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
};

export default Toggleable;
