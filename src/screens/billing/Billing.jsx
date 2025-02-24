import React, { useEffect, useState } from "react";
import Deal from "../../components/Deal";
import { menu } from "../../config/content";
import BillingPreviewTable from "../../components/BillingPreviewTable";
import { Bounce, toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { DB, doc, getDoc, setDoc } from "../../config/firebase";
import { updateDoc } from "firebase/firestore";

const Billing = () => {
  const [inVoiceData, setInVoiceData] = useState([]);
  const [inVoiceItem, setInVoiceItem] = useState({});
  const [dateTime, setDateTime] = useState("");
  const [orders, setOrders] = useState(0);
  const [isClosed, setIsClosed] = useState(false);

  const addDataInDB = async (orderData) => {
    try {
      const uid = localStorage.getItem("user");
      const data = await getDoc(doc(DB, "admins", uid));
      const prevOrderDetailsData = data.data().orderDetails || [];
      prevOrderDetailsData.push(orderData);

      const orderDataToSet = {
        orderDetails: [...prevOrderDetailsData],
      };

      const response = await setDoc(doc(DB, "admins", uid), orderDataToSet);
      toast.success("Order has been punched successfully");
    } catch (error) {
      console.log("Error creating data: ", error);
      toast.error("please check your connection");
    }
  };

  const addItem = (item) => {
    if (typeof inVoiceItem.qty !== "undefined") {
      // Find the index of the object in the array
      const index = inVoiceData.findIndex(
        (existingItem) =>
          existingItem.item.toLowerCase() === inVoiceItem.item.toLowerCase() &&
          existingItem.category.toLowerCase() ===
            inVoiceItem.category.toLowerCase()
      );

      if (index !== -1) {
        const copy = [...inVoiceData];
        copy[index] = inVoiceItem;
        setInVoiceData(copy);
        setInVoiceItem({});
      } else {
        setInVoiceData((prev) => [...prev, inVoiceItem]), setInVoiceItem({});
      }
      toast.success("Item added");
    } else {
      toast.warning("Please enter or increase quantity");
    }
  };

  const printSection = async () => {
    // setDateTime(new Date().toLocaleString());

    localStorage.setItem("order", orders);

    const orderData = {
      orderNum: orders,
      // punchTime: dateTime,
      punchTime: new Date().toLocaleString(),
      orderItems: inVoiceData, //array of object of each item,
      total: inVoiceData.reduce((acc, ci) => acc + ci.totalPrice, 0),
    };

    addDataInDB(orderData);

    const num = Number(localStorage.getItem("order"));
    setOrders(num + 1);
    // setOrders((prev) => Number(localStorage.getItem("order")) + 1);
    const printContent1 = document.getElementById("kot-slip").innerHTML;
    const printContent2 = document.getElementById("customer-slip").innerHTML;

    const printWindow1 = window.open("", "", "width=320,height=auto");

    printWindow1.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              font-family: "Courier New", Courier, monospace;
              font-size: 14px;
              width: 80mm; /* Typical width for thermal printer paper */
              margin: 0;
              padding: 0;
              text-align: center;
              padding: 10px;
              }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printContent1}
          </div>
        </body>
      </html>
    `);
    printWindow1.document.close(); // Important to ensure the content is fully written
    setTimeout(() => {
      printWindow1.print();
    }, 500);

    printWindow1.onafterprint = () => {
      printWindow1.close(); // Close the window after print dialog closes
    };

    let printWindow2;
    setTimeout(() => {
      printWindow2 = window.open("", "", "width=320,height=auto");
      printWindow2.document.write(`
         <html>
           <head>
             <title>Invoice</title>
             <script src="https://cdn.tailwindcss.com"></script>
             <style>
               body {
                 font-family: "Courier New", Courier, monospace;
                 font-size: 14px;
                 width: 80mm; /* Typical width for thermal printer paper */
                 margin: 0;
                 padding: 0;
                 text-align: center;
                 padding: 10px;
                 }
             </style>
           </head>
           <body>
             <div class="invoice-container">
               ${printContent2}
             </div>
           </body>
         </html>
       `);
      printWindow2.print();
      printWindow2.close(); // Close the window after print dialog closes
    }, 500);

    return;
  };

  const eachItemQtyHandler = (e, i, item) => {
    const newItem = { ...item };
    newItem.qty = parseInt(e.target.value);
    newItem.totalPrice = newItem.qty * newItem.totalPrice;
    setInVoiceItem(newItem);
    return;
  };

  // reset handler
  const resetHandler = () => {
    localStorage.setItem("order", "1");
    setOrders(1);
    toast.success("Orders have been reset to 1 ✔");
  };

  useEffect(() => {
    // setOrders(localStorage.getItem("order"));
    if (localStorage.getItem("order") == null) {
      localStorage.setItem("order", "1");
    } else {
      const num = Number(localStorage.getItem("order"));
      setOrders(num + 1);
    }
  }, []);
  return (
    <div>
      <Navbar />
      <h1 className="flex justify-between items-center text-center text-[#ff7043] text-[4em] mb-8 font-bold uppercase">
        <span> </span>
        <span>Billing</span>
        <button
          onClick={resetHandler}
          className="text-[14px] bg-[#fd2029] text-white rounded-full h-[50px] w-[50px] mr-2 hover:shadow-lg"
          title="Reset order number to 1"
        >
          reset
        </button>
      </h1>
      <section>
        {/* Deals */}
        <div className="mb-9">
          <h2 className="text-[36px] uppercase text-center font-[700]">
            Pizza Deals 💳
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 p-2">
            {menu.deals.pizzaDeals.map((pizzaDeal, pizzaDealIndex) => (
              <div className="col-span-1 flex" key={pizzaDealIndex}>
                <Deal
                  addItemHandler={() => addItem(pizzaDeal)}
                  itemData={pizzaDeal}
                  title={pizzaDeal.item}
                  bg="#fd2029"
                  price={pizzaDeal.price}
                />
                <input
                  type="number"
                  min={1}
                  defaultValue={0}
                  className="w-[80px] shadow text-[#008000] text-center"
                  onChange={(e) => {
                    eachItemQtyHandler(e, pizzaDealIndex, pizzaDeal);
                  }}
                />
              </div>
            ))}
          </div>
          <h2 className="text-[36px] uppercase text-center font-[700]">
            Fast Food Deals 💳
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 p-2">
            {menu.deals.fastFoodDeals.map((fastFoodDeal, fastFoodDealIndex) => (
              <div className="col-span-1 flex" key={fastFoodDealIndex}>
                <Deal
                  addItemHandler={() => addItem(fastFoodDeal)}
                  itemData={fastFoodDeal}
                  title={fastFoodDeal.item}
                  bg="#fd2029"
                  price={fastFoodDeal.price}
                />
                <input
                  type="number"
                  min={1}
                  defaultValue={0}
                  className="w-[80px] shadow text-[#008000] text-center"
                  onChange={(e) => {
                    eachItemQtyHandler(e, fastFoodDealIndex, fastFoodDeal);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left */}
        <div className="">
          {/* Pizzas */}
          <div className="">
            <h2 className="text-[36px] uppercase text-center font-[700]">
              pizzas 🍕
            </h2>
            <div className=" grid md:grid-cols-3">
              <div className="">
                <h3 className="text-[#808080] uppercase text-center font-[700] text-[20px]">
                  small
                </h3>
                <div className="flex flex-col gap-2 p-2 justify-center">
                  {menu.pizzas.small.map((flavFries, flavFriesIndex) => (
                    <div className="col-span-1 flex" key={flavFriesIndex}>
                      <Deal
                        addItemHandler={() => addItem(flavFries)}
                        title={flavFries.item}
                        price={flavFries.price}
                        bg="#fd2029"
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, flavFriesIndex, flavFries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="">
                <h3 className="text-[#808080] uppercase text-center font-[700] text-[20px]">
                  Medium
                </h3>
                <div className="flex flex-col gap-2 p-2 justify-center">
                  {menu.pizzas.medium.map((flavFries, flavFriesIndex) => (
                    <div className="col-span-1 flex" key={flavFriesIndex}>
                      <Deal
                        addItemHandler={() => addItem(flavFries)}
                        title={flavFries.item}
                        price={flavFries.price}
                        bg="#fd2029"
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, flavFriesIndex, flavFries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="">
                <h3 className="text-[#808080] uppercase text-center font-[700] text-[20px]">
                  large
                </h3>
                <div className="flex flex-col gap-2 p-2 justify-center">
                  {menu.pizzas.large.map((flavFries, flavFriesIndex) => (
                    <div className="col-span-1 flex" key={flavFriesIndex}>
                      <Deal
                        addItemHandler={() => addItem(flavFries)}
                        title={flavFries.item}
                        price={flavFries.price}
                        bg="#fd2029"
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, flavFriesIndex, flavFries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* lavaPizza */}
          <div className="border">
            <div className="">
              <h2 className="text-[36px] uppercase text-center font-[700]">
                Lava Pizza
              </h2>
              <div className="flex flex-col gap-2 p-2 justify-center">
                {menu.lavaPizzas.map((lavaPizza, lavaPizzaIndex) => (
                  <div className="col-span-1 flex" key={lavaPizzaIndex}>
                    <Deal
                      addItemHandler={() => addItem(lavaPizza)}
                      title={lavaPizza.item}
                      size={lavaPizza.size}
                      price={lavaPizza.price}
                      bg="#fd2029"
                    />
                    <input
                      type="number"
                      min={1}
                      defaultValue={0}
                      className="w-[80px] shadow text-[#008000] text-center"
                      onChange={(e) => {
                        eachItemQtyHandler(e, lavaPizzaIndex, lavaPizza);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* fries */}
          <div className="mt-[125px]">
            <h2 className="text-[36px] uppercase text-center text-center font-[700]">
              Fries 🍟
            </h2>
            <div className="grid sm:grid-cols-2  text-center">
              <div>
                <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
                  Small
                </h3>
                <div className="flex flex-col gap-2 p-2 justify-center">
                  {menu.fries.small.map((fries, friesIndex) => (
                    <div className="col-span-1 flex" key={friesIndex}>
                      <Deal
                        addItemHandler={() => addItem(fries)}
                        title={fries.item}
                        price={fries.price}
                        bg="#fd2029"
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, friesIndex, fries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
                  Large
                </h3>
                <div className="flex flex-col gap-2 justify-center">
                  {menu.fries.large.map((fries, friesIndex) => (
                    <div className="col-span-1 flex" key={friesIndex}>
                      <Deal
                        addItemHandler={() => addItem(fries)}
                        title={fries.item}
                        bg="#fd2029"
                        price={fries.price}
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, friesIndex, fries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* sandwiches & wraps */}
          <div className=" grid sm:grid-cols-2">
            <div>
              <h2 className="text-[36px] uppercase text-center font-[700]">
                Sandwiches 🥪
              </h2>
              <div className="flex flex-col gap-2 p-2">
                {menu.sandwiches.map((sandwich, sandwichIndex) => (
                  <div className="col-span-1 flex" key={sandwichIndex}>
                    <Deal
                      addItemHandler={() => addItem(sandwich)}
                      title={sandwich.item}
                      bg="#fd2029"
                      price={sandwich.price}
                    />
                    <input
                      type="number"
                      min={1}
                      defaultValue={0}
                      className="w-[80px] shadow text-[#008000] text-center"
                      onChange={(e) => {
                        eachItemQtyHandler(e, sandwichIndex, sandwich);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-[36px] uppercase text-center font-[700]">
                Chef Specialist 🥙
              </h2>
              <div className="flex flex-col gap-2 p-2">
                {menu.chefSpecialists.map(
                  (chefSpecialist, chefSpecialistIndex) => (
                    <div className="col-span-1 flex" key={chefSpecialistIndex}>
                      <Deal
                        addItemHandler={() => addItem(chefSpecialist)}
                        title={chefSpecialist.item}
                        bg="#fd2029"
                        price={chefSpecialist.price}
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(
                            e,
                            chefSpecialistIndex,
                            chefSpecialist
                          );
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="">
          {/* Burgers */}
          <div>
            <h2 className="text-[36px] pb-[40px] uppercase text-center font-[700]">
              Burgers 🍔
            </h2>
            <div className="flex flex-col gap-2 p-2">
              {menu.burgers.map((burger, burgerIndex) => (
                <div className="col-span-1 flex" key={burgerIndex}>
                  <Deal
                    addItemHandler={() => addItem(burger)}
                    title={burger.item}
                    bg="#fd2029"
                    price={burger.price}
                  />
                  <input
                    type="number"
                    min={1}
                    defaultValue={0}
                    className="w-[80px] shadow text-[#008000] text-center"
                    onChange={(e) => {
                      eachItemQtyHandler(e, burgerIndex, burger);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Broasts */}
          <div>
            <h2 className="text-[36px] pb-[40px] uppercase text-center font-[700]">
              Broasts 🍗
            </h2>
            <div className="flex flex-col gap-2 p-2">
              {menu.broasts.map((broast, broastIndex) => (
                <div className="col-span-1 flex" key={broastIndex}>
                  <Deal
                    addItemHandler={() => addItem(broast)}
                    title={broast.item}
                    bg="#fd2029"
                    price={broast.price}
                  />
                  <input
                    type="number"
                    min={1}
                    defaultValue={0}
                    className="w-[80px] shadow text-[#008000] text-center"
                    onChange={(e) => {
                      eachItemQtyHandler(e, broastIndex, broast);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* pizza fries */}
          {/* <div className="">
            <h2 className="text-[36px] uppercase text-center font-[700]">
              Pizza Fries 🍕🍟
            </h2>
            <div className="grid sm:grid-cols-2 gap-2 text-center ">
              <div>
                <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
                  Small
                </h3>
                <div className="flex flex-col gap-2 p-2">
                  {menu.pizzaFries.small.map((pizzaFries, pizzaFriesIndex) => (
                    <div className="col-span-1 flex  " key={pizzaFriesIndex}>
                      <Deal
                        addItemHandler={() => addItem(pizzaFries)}
                        title={pizzaFries.item}
                        bg="#fd2029"
                        price={pizzaFries.price}
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, pizzaFriesIndex, pizzaFries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
                  Large
                </h3>
                <div className="flex flex-col gap-2 p-2">
                  {menu.pizzaFries.large.map((pizzaFries, pizzaFriesIndex) => (
                    <div className="col-span-1 flex" key={pizzaFriesIndex}>
                      <Deal
                        addItemHandler={() => addItem(pizzaFries)}
                        title={pizzaFries.item}
                        bg="#fd2029"
                        price={pizzaFries.price}
                      />
                      <input
                        type="number"
                        min={1}
                        defaultValue={0}
                        className="w-[80px] shadow text-[#008000] text-center"
                        onChange={(e) => {
                          eachItemQtyHandler(e, pizzaFriesIndex, pizzaFries);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          {/* Soft Drinks */}
          <div className="">
            <h2 className="text-[36px] uppercase text-center font-[700]">
              Soft Drinks 🍾
            </h2>
            <div className="flex flex-col gap-2 p-2">
              {menu.softDrinks.map((softDrink, softDrinkIndex) => (
                <div className="col-span-1 flex" key={softDrinkIndex}>
                  <Deal
                    addItemHandler={() => addItem(softDrink)}
                    title={softDrink.item}
                    bg="#fd2029"
                    price={softDrink.price}
                  />
                  <input
                    type="number"
                    min={1}
                    defaultValue={0}
                    className="w-[80px] shadow text-[#008000] text-center"
                    onChange={(e) => {
                      eachItemQtyHandler(e, softDrinkIndex, softDrink);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Dips */}
          <div className="">
            <h2 className="text-[36px] uppercase text-center font-[700]">
              Extra
            </h2>
            <div className="flex flex-col gap-2 p-2">
              {menu.dips.map((dip, dipIndex) => (
                <div className="col-span-1 flex" key={dipIndex}>
                  <Deal
                    addItemHandler={() => addItem(dip)}
                    title={dip.item}
                    bg="#fd2029"
                    price={dip.price}
                  />
                  <input
                    type="number"
                    min={1}
                    defaultValue={0}
                    className="w-[80px] shadow text-[#008000] text-center"
                    onChange={(e) => {
                      eachItemQtyHandler(e, dipIndex, dip);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* --------------------------- */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Deals</h2>
        <div className="grid grid-cols-12 gap-2 ">
          {menu.deals.map((deal, dealIndex) => (
            <div className="col-span-1 " key={dealIndex}>
              <Deal
                addItemHandler={() => addItem(deal)}
                itemData={deal}
                title={deal.item}
                bg="#fd2029"
              />
            </div>
          ))}
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Flavour Fries</h2>
        <div className="grid grid-cols-2  text-center">
          <div>
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">Small</h3>
            <div className="flex gap-2 justify-center">
              {menu.flavourFries.small.map((flavFries, flavFriesIndex) => (
                <div className="col-span-1" key={flavFriesIndex}>
                  <Deal
                    addItemHandler={() => addItem(flavFries)}
                    title={flavFries.item}
                    bg="#fd2029"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">Large</h3>
            <div className="flex gap-2 justify-center">
              {menu.flavourFries.large.map((flavFries, flavFriesIndex) => (
                <div className="col-span-1 " key={flavFriesIndex}>
                  <Deal
                    addItemHandler={() => addItem(flavFries)}
                    title={flavFries.item}
                    bg="#fd2029"
                  />
                </div>
              ))}
            </div>
          </div>
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Wraps</h2>
        <div className="flex gap-2">
          {menu.wraps.map((wrap, wrapIndex) => (
            <div className="col-span-1 " key={wrapIndex}>
              <Deal
                addItemHandler={() => addItem(wrap)}
                title={wrap.item}
                bg="#fd2029"
              />
            </div>
          ))}
        </div> */}

        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Pizza Fries</h2>
        <div className="grid grid-cols-2 gap-2 text-center ">
          <div>
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">Small</h3>
            <div className="flex gap-2">
              {menu.pizzaFries.small.map((pizzaFries, pizzaFriesIndex) => (
                <div className="col-span-1 " key={pizzaFriesIndex}>
                  <Deal
                    addItemHandler={() => addItem(pizzaFries)}
                    title={pizzaFries.item}
                    bg="#fd2029"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">Large</h3>
            <div className="flex gap-2">
              {menu.pizzaFries.large.map((pizzaFries, pizzaFriesIndex) => (
                <div className="col-span-1" key={pizzaFriesIndex}>
                  <Deal
                    addItemHandler={() => addItem(pizzaFries)}
                    title={pizzaFries.item}
                    bg="#fd2029"
                  />
                </div>
              ))}
            </div>
          </div>
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Sandwiches</h2>
        <div className="flex gap-2">
          {menu.sandwiches.map((flavFries, flavFriesIndex) => (
            <div className="col-span-1 " key={flavFriesIndex}>
              <Deal
                addItemHandler={() => addItem(flavFries)}
                title={flavFries.item}
                bg="#fd2029"
              />
            </div>
          ))}
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Burgers</h2>
        <div className="flex gap-2">
          {menu.burgers.map((burger, burgerIndex) => (
            <div className="col-span-1 " key={burgerIndex}>
              <Deal
                addItemHandler={() => addItem(burger)}
                title={burger.item}
                bg="#fd2029"
              />
            </div>
          ))}
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">Pizza</h2>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center">
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
              Small
            </h3>
            <div className="flex gap-2">
              {menu.pizzas.small.map((pizza, pizzaIndex) => (
                <div className="col-span-1 " key={pizzaIndex}>
                  <Deal
                    addItemHandler={() => addItem(pizza)}
                    title={pizza.item}
                    bg="#fd2029"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
              Medium
            </h3>
            <div className="flex gap-2">
              {menu.pizzas.medium.map((pizza, pizzaIndex) => (
                <div className="col-span-1 " key={pizzaIndex}>
                  <Deal
                    addItemHandler={() => addItem(pizza)}
                    title={pizza.item}
                    bg="#fd2029c2"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-[#808080] uppercase font-[700] text-[20px]">
              Large
            </h3>
            <div className="flex gap-2">
              {menu.pizzas.large.map((pizza, pizzaIndex) => (
                <div className="col-span-1 " key={pizzaIndex}>
                  <Deal
                    addItemHandler={() => addItem(pizza)}
                    title={pizza.item}
                    bg="#fd2029"
                  />
                </div>
              ))}
            </div>
          </div>
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">
          Soft Drinks
        </h2>
        <div className="flex gap-2">
          {menu.softDrinks.map((softDrink, softDrinkIndex) => (
            <div className="col-span-1 " key={softDrinkIndex}>
              <Deal
                addItemHandler={() => addItem(softDrink)}
                title={softDrink.item}
                bg="#fd2029"
              />
            </div>
          ))}
        </div> */}
        {/* <h2 className="text-[36px] uppercase text-center font-[700]">DIPs</h2>
        <div className="flex gap-2">
          {menu.dips.map((dip, dipIndex) => (
            <div className="col-span-1 " key={dipIndex}>
              <Deal
                addItemHandler={() => addItem(dip)}
                title={dip.item}
                bg="#fd2029"
              />
            </div>
          ))}
        </div> */}
      </section>
      <section className="flex flex-col mt-[4em]">
        <div className="">
          <BillingPreviewTable
            inVoiceData={inVoiceData}
            dateTime={dateTime}
            // orders={orders}
          />
          {/* <BillingPreviewTable  /> */}
        </div>
        <button
          onClick={printSection}
          className="container d-flex self-center bg-indigo-600 text-white w-full py-2 px-4 rounded mt-7 mb-6"
        >
          Print Invoice
        </button>
      </section>
    </div>
  );
};

export default Billing;
