import React, { useEffect, useState } from "react";
// import './DBOrders.styles.scss'
function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from your database here and set them in the "orders" state.
    // Example: fetchOrders().then((data) => setOrders(data));
  }, []);

  return (
    <div className="orders-page-container">
      <h1 className="orders-title">Orders</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Order Date</th>
              <th>Products Ordered</th>
              <th>Customer Name</th>
              <th>Shipping Address</th>
              <th>Shipping Cost</th>
              <th>Contact Information</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{order.orderDate}</td>
                <td>{order.productsOrdered}</td>
                <td>{order.customerName}</td>
                <td>{order.shippingAddress}</td>
                <td>{order.shippingCost}</td>
                <td>{order.contactInfo}</td>
                <td>{order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersPage;
