import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../../utils/firebase/firebase.utils";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(50));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <div style={{ padding: "1rem", color: "white" }}>
      <h1>Orders</h1>

      {orders.map((o) => (
        <div key={o.id} style={{ border: "1px solid #444", padding: 12, marginBottom: 12 }}>
          <div><strong>Order:</strong> {o.id}</div>
          <div><strong>Status:</strong> {o.status}</div>
          <div><strong>Total:</strong> ${(o.totalCents / 100).toFixed(2)}</div>
          <div><strong>Items:</strong> {o.items?.map(i => `${i.nameSnapshot} x${i.qty}`).join(", ")}</div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
