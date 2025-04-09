"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    category: "",
    price: 0,
    rating: 0,
  });

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const isLoggedIn = !!token;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("/api/product");
    setProducts(res.data);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (err) {
      alert("Unauthorized or error deleting product");
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("/api/product", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({ name: "", description: "", category: "", price: 0, rating: 0 });
      fetchProducts();
    } catch (err) {
      alert("Unauthorized or error adding product");
    }
  };


  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">🛒 Product Dashboard</h1>

      {isLoggedIn && (
        <div className="mb-8 border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="p-2 border rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="p-2 border rounded"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            />
            <input
              className="p-2 border rounded"
              type="number"
              placeholder="Rating"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
            />
            <button
              onClick={handleAdd}
              className="col-span-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-sm text-gray-600">Category: {product.category}</p>
            <p className="text-sm">Price: ${product.price}</p>
            <p className="text-sm">Rating: ⭐ {product.rating}</p>
            {isLoggedIn && (
              <button
                onClick={() => handleDelete(product.id)}
                className="mt-2 text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
