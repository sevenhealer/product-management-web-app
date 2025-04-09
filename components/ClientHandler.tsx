"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientHeader() {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null)
  };

  return (
    <div className="border-b p-4 text-2xl flex justify-between items-center">
      <div>Product Management</div>
      <div className="text-base space-x-4">
        {!token ? (
          <>
            <Link href="/signin" className="text-blue-600 hover:underline">Signin</Link>
            <Link href="/signup" className="text-blue-600 hover:underline">Signup</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
