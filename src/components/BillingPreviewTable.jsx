import React, { useEffect, useState } from "react";
import { FoodHub_Logo } from "../assets/images";

const data = [
  { sno: 1, item: "Apple", qty: 2, price: 3, tot: 6 },
  { sno: 2, item: "Banana", qty: 3, price: 1, tot: 3 },
  { sno: 3, item: "Orange", qty: 1, price: 2, tot: 2 },
  { sno: 4, item: "Grapes", qty: 5, price: 4, tot: 20 },
];

const BillingPreviewTable = ({ inVoiceData, orders }) => {
  const [invoiceDataCpy, setInvoiceDataCpy] = useState([...inVoiceData]);
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [indTotal, setIndTotal] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [returningAmount, setReturningAmount] = useState(0);

  const qtyChangHandler = (e, index) => {
    const newQty = parseInt(e.target.value);
    const updatedItems = [...inVoiceData];
    updatedItems[index].qty = newQty;
    updatedItems[index].totalPrice = updatedItems[index].price * newQty; // Recalculate the totalPrice

    setInvoiceDataCpy(updatedItems);
    // setItems(updatedItems); // Update the state with the modified array
  };
  const calculateTotal = () => {
    const totalBill = inVoiceData.reduce((acc, num) => acc + num.totalPrice, 0);
    setTotalBillAmount(totalBill);
  };

  const remOrRetTotal = (e) => {
    const calRemAmt = totalBillAmount - e.target.value;
    // const calRetAmt = totalBillAmount - e.target.value;
    if (calRemAmt > 0) {
      setRemainingAmount(calRemAmt);
      setReturningAmount(0);
    } else {
      setReturningAmount(calRemAmt);
      setRemainingAmount(0);
    }
  };

  useEffect(() => {
    calculateTotal();
    setDateTime(new Date().toLocaleString());
  }, [inVoiceData]);

  return (
    <>
      {/* KOT Slip*/}
      <div
        id="kot-slip"
        className="container mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <div>
          {/* Invoice Header */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "10px",
              }}
            >
              <span>Food Hub</span>
              <img
                // src={BurgerOFires_Logo}
                src="https://food-hub-hsd.web.app/assets/Logo-C6Jck3QD.jpg"
                style={{ width: "50px", borderRadius: 7 }}
                alt="FoodHub_Logo"
              />
            </h1>
            <p style={{ fontSize: "15px", lineHeight: "1rem" }}>
              Shop G3, Gohar complex, Liaquat Ali Khan Rd, Model Colony Karachi,
              Karachi City, Sindh
            </p>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              Phone: +92 314 8387574
              <span style={{ fontSize: "small" }}>(Delivery)</span>
            </p>
            <hr style={{ margin: "1rem 0" }} />
            <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
              {/* Order: {orders} */}
              Order: {localStorage.getItem("order")}
            </h2>
            <p style={{ fontSize: "15px" }}>Date: {dateTime}</p>
          </div>

          {/* Customer Details */}
          {/* <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  Customer:
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="Enter Customer Name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                    }}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #ccc",
                      outline: "none",
                      padding: "5px 0",
                      fontSize: "1rem",
                    }}
                  />
                </p>
              </div>
            </div>
          </div> */}

          {/* Itemized List */}
          <div
            style={{
              // overflowX: "auto",
              marginTop: "1.5rem",
              // marginBottom: "1.5rem",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "3px 0",
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  <th
                    style={{
                      width: "15%",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 0",
                    }}
                  >
                    Sn
                  </th>
                  <th
                    style={{
                      width: "40%",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 0",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 0",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      width: "15%",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 0",
                    }}
                  >
                    Price
                  </th>
                  <th
                    className="hhh"
                    style={{
                      width: "15%",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 0",
                    }}
                  >
                    Tot
                  </th>
                </tr>
              </thead>
              <tbody>
                {inVoiceData.map((row, index) => (
                  <tr
                    key={index + 1}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "3px 0",
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9", // Alternating row colors
                    }}
                  >
                    <td
                      style={{
                        width: "15%",
                        textAlign: "left",
                        fontSize: "12px",
                        padding: "6px 0",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        width: "40%",
                        textAlign: "left",
                        fontSize: "12px",
                        padding: "6px 0",
                      }}
                    >
                      {row.item} ({row.category.toLowerCase()})
                    </td>
                    <td
                      style={{
                        width: "15%",
                        textAlign: "center",
                        fontSize: "12px",
                        padding: "6px 0",
                      }}
                    >
                      {row.qty}
                    </td>
                    <td
                      style={{
                        width: "15%",
                        textAlign: "right",
                        fontSize: "12px",
                        padding: "6px 0",
                      }}
                    >
                      {row.price}/-
                    </td>
                    <td
                      style={{
                        width: "15%",
                        textAlign: "right",
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "6px 0",
                      }}
                    >
                      {row.totalPrice}/-
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.125rem",
              fontWeight: "600",
              borderTop: "2px solid",
            }}
          >
            <div style={{ width: "50%" }}>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>Total:</p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                Customer Payment:
              </p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                Outstanding Amount:
              </p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                Excess Payment:
              </p>
            </div>
            <div style={{ width: "50%", textAlign: "right" }}>
              <p style={{ fontSize: "12px" }}>{totalBillAmount}</p>
              <p>
                <input
                  type="number"
                  placeholder="customer amount"
                  value={receivedAmount}
                  onChange={(e) => {
                    setReceivedAmount(e.target.value);
                    remOrRetTotal(e);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    textAlign: "right",
                    color: "red",
                    fontWeight: 900,
                    fontSize: "12px",
                    MozAppearance: "textfield", // For Firefox
                    WebkitAppearance: "none", // For Chrome, Safari, Edge
                    appearance: "none", // To cover other browsers as well
                  }}
                />
              </p>
              <p style={{ fontSize: "12px" }}>{remainingAmount}</p>
              <p style={{ fontSize: "12px" }}>{returningAmount}</p>
            </div>
          </div>

          {/* <hr style={{ margin: "1rem 0" }} /> */}

          {/* Footer Note */}
          <div
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              // color: "#6B7280",
            }}
          >
            <p>Thank you for choosing us!</p>
            <p>For inquiries, contact us at +92 314 8387574</p>
            <div
              style={{
                textAlign: "center",
                fontSize: "10px",
                fontWeight: 600,
                marginTop: "20px",
                // color: "#6B7280",
              }}
            >
              <p>
                {" "}
                <strong>Developed by HSquare Development</strong>
                <br />
                <strong>+92 327-2086685</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Slip */}

      <div
        id="customer-slip"
        className="container mx-auto p-6 bg-white shadow-lg rounded-lg"
        style={{ marginTop: "10px" }}
      >
        <div>
          {/* Invoice Header */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "10px",
              }}
            >
              <span>Food Hub</span>
              <img
                // src={BurgerOFires_Logo}
                src="https://food-hub-hsd.web.app/assets/Logo-C6Jck3QD.jpg"
                style={{ width: "50px", borderRadius: 7 }}
                alt="FoodHub_Logo"
              />
            </h1>
            {/* <p style={{ fontSize: "15px", lineHeight: "1rem" }}>
              Shop # G-7 Gohar Complex, Plot No: 443, Beside Liaquat Ali Khan
              Road, Model Colony, Karachi
            </p>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              Phone: 0316-2557669{" "}
              <span style={{ fontSize: "small" }}>(Delivery)</span>
            </p>
            <hr style={{ margin: "1rem 0" }} /> */}
            <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
              {/* Order: {orders} */}
              Order: {localStorage.getItem("order")}
            </h2>
            <p style={{ fontSize: "15px" }}>Date: {dateTime}</p>
          </div>

          {/* Customer Details */}
          {/* <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  Customer: {customerName}
                </p>
              </div>
            </div>
          </div> */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1.5rem",
              fontSize: "1.125rem",
              fontWeight: "600",
              borderTop: "2px solid",
            }}
          >
            <div style={{ width: "50%" }}>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>Total:</p>
              {/* <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                Customer Payment:
              </p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                Outstanding Amount:
              </p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                Excess Payment:
              </p> */}
            </div>
            <div style={{ width: "50%", textAlign: "right" }}>
              <p style={{ fontSize: "12px" }}>{totalBillAmount}</p>
              {/* <p
                style={{
                  width: "100%",
                  textAlign: "right",
                  color: "#008000",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {receivedAmount}
              </p>
              <p style={{ fontSize: "12px" }}>{remainingAmount}</p>
              <p style={{ fontSize: "12px" }}>{returningAmount}</p> */}
            </div>
          </div>

          {/* <hr style={{ margin: "1rem 0" }} /> */}

          {/* Footer Note */}
          {/* <div
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            <p>Thank you for dining with us!</p>
            <p>For inquiries, contact us at 0316-2557669</p>
            <div
              style={{
                textAlign: "center",
                fontSize: "10px",
                fontWeight: 600,
                marginTop: "20px",
              }}
            >
              <p>Developed by HSquare Development</p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default BillingPreviewTable;
