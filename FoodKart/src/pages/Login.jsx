import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to move between pages

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      
      const res = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password
      });

      if (res.data.success) {
        toast.success("Login Successful!");
        localStorage.setItem("user", "admin");
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (err) {
      toast.error("Invalid Username or Password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <Toaster />
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">🔐 Admin Login</h2>
          
          <form onSubmit={handleLogin}>
            {/* Username Input */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input 
                type="text" 
                placeholder="Type here" 
                className="input input-bordered w-full max-w-xs" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Type here" 
                className="input input-bordered w-full max-w-xs" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-center mt-6">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}