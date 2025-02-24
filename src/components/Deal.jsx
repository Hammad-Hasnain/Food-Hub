import React from "react";

const Deal = ({ addItemHandler, title, price, size, bg }) => {
  return (
    <button
      onClick={addItemHandler}
      className={`w-full h-full text-[20px] uppercase font-[900] tracking-[1px] p-2 shadow border rounded hover:transform hover:scale-105`}
      style={{ backgroundColor: bg }}
    >
      <span>
        {title} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {size}
      </span>
      <br />
      <span>Rs: {price}/-</span>
    </button>
  );
};

export default Deal;
