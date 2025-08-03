/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useFarmerDashboard } from '../hooks/useFarmerDashboard';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error, refetch } = useFarmerDashboard();

  if (!user || user.role !== 'farmer') {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-lg font-medium mb-2">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-2">Failed to load: {(error as any)?.message || 'Unknown'}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const { profile, products, incomingOrders } = data;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        </div>
      </header>

      {/* Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 p-4 border rounded shadow-sm">
          <h2 className="font-semibold mb-2">Farm Profile</h2>
          <p>
            <span className="font-medium">Farm Name:</span>{' '}
            {profile?.farmName || 'Not set'}
          </p>
          <p>
            <span className="font-medium">Location:</span>{' '}
            {profile?.location || '—'}
          </p>
          <p>
            <span className="font-medium">Bio:</span>{' '}
            {profile?.bio || '—'}
          </p>
        </div>
        <div className="col-span-1 p-4 border rounded shadow-sm">
          <h2 className="font-semibold mb-2">Your Products</h2>
          <p>{products?.length ?? 0} total</p>
          <ul className="mt-2 space-y-1 text-sm">
            {products && products.length > 0 ? (
              products.map((p: any) => (
                <li key={p._id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-gray-500 text-xs">{p.category}</div>
                  </div>
                  <div className="text-right">
                    <div>${p.price.toFixed(2)}</div>
                    <div className="text-xs">
                      {p.quantityAvailable} in stock
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No products yet.</li>
            )}
          </ul>
        </div>
        <div className="col-span-1 p-4 border rounded shadow-sm">
          <h2 className="font-semibold mb-2">Incoming Orders</h2>
          <p>{incomingOrders?.length ?? 0} order(s)</p>
        </div>
      </section>

      {/* Orders Detail */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Incoming Orders</h2>
        {incomingOrders && incomingOrders.length > 0 ? (
          <div className="space-y-6">
            {incomingOrders.map((order: any) => (
              <div
                key={order.orderId}
                className="border rounded p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-500">
                      Order ID: {order.orderId}
                    </div>
                    <div>
                      <span className="font-medium">Customer:</span>{' '}
                      {order.customer}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${order.totalAmount?.toFixed(2)}
                    </div>
                    <div className="text-xs">Status: {order.status}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-medium mb-1">Your Items:</div>
                  <ul className="space-y-1">
                    {order.items.map((it: any, i: number) => (
                      <li
                        key={i}
                        className="flex justify-between text-sm border-b pb-2 mb-2"
                      >
                        <div>
                          <div>{it.name}</div>
                          <div className="text-gray-500">
                            Qty: {it.quantity}
                          </div>
                        </div>
                        <div>${(it.price * it.quantity).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600">No incoming orders yet.</div>
        )}
      </section>
    </div>
  );
};

export default FarmerDashboard;
