import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';//notification above
import { FaShoppingCart, FaTrash, FaUtensils, FaHamburger, FaCoffee } from 'react-icons/fa';

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Fetch Menu
  useEffect(() => {
    axios.get('http://localhost:5000/menu')
      .then(res => setMenu(res.data))
      .catch(err => toast.error("Failed to load menu"));
  }, []);

  // 2. Cart 
  const addToCart = (item) => {
    setCart([...cart, item]);//append items 
    toast.success(`Added ${item.name}`);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
    toast("Item removed", { icon: '🗑️' });
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + Number(item.price), 0);

  // 3. Place Order Logic
  const handleOrder = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty!");
    
    // Simple Prompt for Name (Can be replaced with an input in the modal later)
    const name = prompt("Please enter your name for the order:");
    if (!name) return;

    try {
      await axios.post('http://localhost:5000/orders', {
        name: name,
        total: calculateTotal(),
        items: cart
      });
      toast.success("Order Placed Successfully! 🍳");
      setCart([]); // Clear cart
      setIsCartOpen(false); // Close modal
    } catch (err) {
      toast.error("Order failed. Is backend running?");
    }
  };

  // Filter
  const filteredMenu = activeCategory === "All"? menu : menu.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <Toaster position="top-center" />

      {/* --- NAVBAR --- */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-primary font-bold">
            <FaUtensils /> FoodKart
          </a>
        </div>
        <div className="flex-none">
          <div role="button" className="btn btn-ghost btn-circle" onClick={() => setIsCartOpen(true)}>
              <div className="indicator">
                <FaShoppingCart size={25} />
                <span className="badge badge-sm indicator-item badge-primary">{cart.length}</span>
              </div>
            </div>
          
        </div>
      </div>

      {/* --- HERO / CATEGORIES --- */}
      <div className="container mx-auto p-4">
        <div className="flex justify-center gap-2 my-6 overflow-x-auto">
          {["All", "Main", "Side", "Drink"].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            >
              {cat === "Main" && <FaHamburger />}
              {cat === "Drink" && <FaCoffee />}
              {cat}
            </button> 
          ))}
        </div>

        {/* --- MENU GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {filteredMenu.map((item) => (
            <div key={item.id} className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-all">
              <figure className="h-48 overflow-hidden">
                <img 
                  src={item.image_url || "https://placehold.co/400?text=Food"} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://placehold.co/400?text=No+Image"} 
                />
              </figure>
              <div className="card-body p-5">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{item.name}</h2>
                  <div className="badge badge-secondary badge-outline">₹{item.price}</div>
                </div>
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCartOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2" 
              onClick={() => setIsCartOpen(false)}
            >✕</button>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FaShoppingCart /> Your Cart
            </h3>
            
            <div className="py-4 max-h-[60vh] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Cart is empty 😔</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-base-200 p-3 mb-2 rounded-lg">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs">₹{item.price}</p>
                    </div>
                    <button 
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => removeFromCart(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="modal-action flex justify-between items-center border-t pt-4">
              <div className="text-xl font-bold">Total: ₹{calculateTotal()}</div>
              <button className="btn btn-success text-white" onClick={handleOrder}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}