import React from "react";
import Navbar from "../../components/Navbar";
import { FastFood_Deal, Menu_1, Menu_2, Pizza_Deal } from "../../assets/images";

const DealsMenu = () => {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-2">
        <img src={Menu_1} alt="menu_1" className="w-full" />
        <img src={Menu_2} alt="menu_2" className="w-full" />
        <img src={Pizza_Deal} alt="pizza_deal" className="w-full" />
        <img src={FastFood_Deal} alt="fast_food_deal" className="w-full" />
      </div>
    </div>
  );
};

export default DealsMenu;
