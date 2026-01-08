import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
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
    setCart([...cart, item]);
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
    
    const name = prompt("Please enter your name for the order:");
    if (!name) return;

    try {
      await axios.post('http://localhost:5000/orders', {
        name: name,
        total: calculateTotal(),
        items: cart
      });
      toast.success("Order Placed Successfully! 🍳");
      setCart([]);
      setIsCartOpen(false);
    } catch (err) {
      toast.error("Order failed. Is backend running?");
    }
  };

  // Filter
  const filteredMenu = activeCategory === "All"? menu : menu.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-yellow-50 pb-20">
      <Toaster position="top-center" />

      {/* --- NAVBAR --- */}
      <div className="navbar bg-white shadow-md sticky top-0 z-50 px-6">
        <div className="flex-1">
          <a className="flex items-center gap-2 text-2xl font-bold text-orange-600">
            <FaUtensils className="text-3xl" /> 
            <span>FoodKart</span>
          </a>
        </div>
        <div className="flex-none">
          <button 
            className="relative btn btn-ghost btn-circle hover:bg-orange-100" 
            onClick={() => setIsCartOpen(true)}
          >
            <FaShoppingCart size={24} className="text-orange-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- HERO / CATEGORIES --- */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What would you like to eat?</h2>
          <p className="text-gray-600">Choose from our delicious menu</p>
        </div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {["All", "Main", "Side", "Drink"].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-md gap-2 ${
                activeCategory === cat 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white border-none' 
                  : 'btn-outline border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
              }`}
            >
              {cat === "Main" && <FaHamburger />}
              {cat === "Drink" && <FaCoffee />}
              {cat}
            </button> 
          ))}
        </div>

        {/* --- MENU GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <div key={item.id} className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <figure className="h-52 overflow-hidden bg-gray-100">
                <img 
                  src={item.image_url || "https://placehold.co/400?text=Food"} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => e.target.src = "https://placehold.co/400?text=No+Image"} 
                />
              </figure>
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="card-title text-lg text-gray-800">{item.name}</h2>
                  <div className="text-lg font-bold text-orange-600">₹{item.price}</div>
                </div>
                <p className="text-sm text-gray-500 capitalize mb-3">{item.category}</p>
                <div className="card-actions">
                  <button 
                    className="btn bg-orange-600 hover:bg-orange-700 text-white border-none w-full" 
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found in this category</p>
          </div>
        )}
      </div>

      {/* --- CART MODAL --- */}
      {isCartOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-lg bg-white">
            <button 
              className="btn btn-sm btn-circle absolute right-3 top-3 bg-gray-200 hover:bg-gray-300 border-none" 
              onClick={() => setIsCartOpen(false)}
            >✕</button>
            
            <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-4">
              <FaShoppingCart className="text-orange-600" /> Your Cart
            </h3>
            
            <div className="py-4 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-orange-50 p-4 mb-3 rounded-lg border border-orange-100">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-orange-600 font-medium mt-1">₹{item.price}</p>
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50"
                      onClick={() => removeFromCart(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-orange-600">₹{calculateTotal()}</span>
                </div>
                <button 
                  className="btn bg-green-600 hover:bg-green-700 text-white border-none w-full text-lg" 
                  onClick={handleOrder}
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}