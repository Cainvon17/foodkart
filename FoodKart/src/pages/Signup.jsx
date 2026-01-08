import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/register', {
                username: username,
                password: password
            });
            if (res.data.success) {
            toast.success("Account Created! Redirecting to Login...");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup Failed");
        }
        }

    return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <Toaster />
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">🚀 Create Account</h2>
          
          <form onSubmit={handleSignup}>
            <div className="form-control w-full max-w-xs">
              <label className="label"><span className="label-text">Username</span></label>
              <input 
                type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                value={username} onChange={(e) => setUsername(e.target.value)} required
              />
            </div>

            <div className="form-control w-full max-w-xs mt-4">
              <label className="label"><span className="label-text">Password</span></label>
              <input 
                type="password" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>

            <div className="card-actions justify-center mt-6">
              <button className="btn btn-secondary w-full">Sign Up</button>
            </div>
          </form>

          {/* Link to switch back to Login */}
          <p className="text-center mt-4 text-sm">
            Already have an account? <Link to="/login" className="link link-primary">Login here</Link>
          </p>

        </div>
      </div>
    </div>
  );
}