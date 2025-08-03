/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import { useCustomerOverviewData } from '@/hooks/useCustomerOverview'; // we'll define below
import { useCart } from "../hooks/useCart";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import { useAuthStore } from "../stores/authStore";
import { Navigate, Link } from "react-router";

const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useCustomerOrders();

  if (!user || user.role !== "customer") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
        </div>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold mb-2">Cart Summary</h2>
          {cartLoading ? (
            <div>Loading cart...</div>
          ) : cartData && cartData.items.length > 0 ? (
            <ul className="space-y-2">
              {cartData.items.map((item: any) => (
                <li key={item.product} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div>${(item.priceAtAdd * item.quantity).toFixed(2)}</div>
                </li>
              ))}
              <li className="mt-2 font-semibold">
                Total: $
                {cartData.items
                  .reduce(
                    (sum: number, it: any) => sum + it.priceAtAdd * it.quantity,
                    0
                  )
                  .toFixed(2)}
              </li>
            </ul>
          ) : (
            <div className="text-gray-500">Your cart is empty.</div>
          )}
          <div className="mt-3">
            <Link
              to="/checkout"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>

        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold mb-2">Recent Orders</h2>
          {ordersLoading ? (
            <div>Loading orders...</div>
          ) : ordersError ? (
            <div className="text-red-600">
              Failed to load orders.{" "}
              <button
                onClick={() => refetchOrders()}
                className="underline text-blue-600"
              >
                Retry
              </button>
            </div>
          ) : ordersData && ordersData.length > 0 ? (
            <ul className="space-y-3">
              {ordersData.map((o: any) => (
                <li
                  key={o._id}
                  className="border rounded p-3 flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium">Order #{o._id.slice(-6)}</div>
                    <div className="text-xs text-gray-500">
                      Placed on {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">Status: {o.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${o.totalAmount.toFixed(2)}
                    </div>
                    <Link
                      to={`/orders/${o._id}`}
                      className="text-sm text-blue-600 underline"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">You have no past orders.</div>
          )}
        </div>
      </section>

      {/* Account Info */}
      <section className="p-4 border rounded shadow-sm">
        <h2 className="font-semibold mb-2">Account Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Name</div>
            <div>{user.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Email</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Role</div>
            <div>{user.role}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
