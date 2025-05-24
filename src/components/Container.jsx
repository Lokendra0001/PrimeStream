import React from "react";

function Container({ children, className }) {
  return (
    <div className={`max-w-[1440px] w-full  mx-auto  ${className}`}>
      {children}
    </div>
  );
}

export default Container;
