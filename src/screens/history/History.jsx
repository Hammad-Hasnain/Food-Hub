import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { DB, doc, getDoc } from "../../config/firebase/index";
import Footer from "../../components/Footer";

const History = () => {
  const [userData, setUserData] = useState({});
  const getData = async () => {
    try {
      const uid = localStorage.getItem("user");
      const response = await getDoc(doc(DB, "admins", uid));
      const data = response.data();

      // const ext = data.orderDetails[0].orderItems
      //   .map((e) => `${e.item} x ${e.qty}`)
      //   .join(", ");
      setUserData(data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-[100vh] flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="overflow-x-auto bg-white shadow-md rounded-lg my-9 mx-5">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-6 py-3 text-left">S.no</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Order No.</th>
                <th className="px-6 py-3 text-left">Created At</th>
                <th className="px-6 py-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {!userData.orderDetails ? (
                <tr>
                  <td className="text-center" colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : (
                userData.orderDetails.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-b cursor-arrow ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                    title={item.orderItems
                      .map((e) => `(${e.item}: ${e.qty} x ${e.price})`)
                      .join(", ")}
                  >
                    {/* <td className="px-6 py-4">
                      {item.orderItems
                        .map((e) => `(${e.item} x ${e.qty})`)
                        .join(", ")}
                    </td> */}
                    <td className="px-6 py-4">{index + 1}.</td>
                    <td className="px-6 py-4">
                      {item.orderItems
                        .map((e) => `(${e.item}: ${e.qty} x ${e.price})`)
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4">{item.orderNum}</td>
                    <td className="px-6 py-4">{item.punchTime}</td>
                    <td className="px-6 py-4">{item.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default History;
