import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement API login logic here
    console.log("Login:", { email, password });
  };

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="mt-4">
        <input
          type="email"
          placeholder="Email"
          className="block border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block border p-2 w-full mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
