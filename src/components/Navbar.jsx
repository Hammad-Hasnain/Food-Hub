import React from "react";
import { FoodHub_Logo } from "../assets/images";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    // <nav className="bg-[#bfaea4]">
    <nav className="flex justify-between items-center bg-[#1a0301] p-2 ">
      <img
        src={FoodHub_Logo}
        alt="FoodHub_Logo"
        className="w-[50px]"
        title="Burger O'Fires"
      />
      <ul className="flex me-5">
        <li>
          <Link to="/" className="text-[#ffffff] font-[600] px-2 border-e">
            Menu
          </Link>
        </li>
        <li>
          <Link to="/deals" className="text-[#ffffff] font-[600] px-2 border-e">
            Deals
          </Link>
        </li>
        <li>
          <Link to="/history" className="text-[#ffffff] font-[600] px-2">
            History
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
