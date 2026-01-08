## 🛠️ Setup & Installation

1. **Clone the repository**
   git clone https://github.com/Cainvon17/foodkart.git
   
   cd FOODKART

3. **Install Dependencies**
   Navigate to the server and client folders and run:
   
   npm install

5. **Database Setup (IMPORTANT)**
   - Open pgAdmin or your PostgreSQL terminal.
   - Create a new database named `foodkart` (or whatever name you used).
   - Open the `database.sql` file provided in this repo.
   - Copy the SQL commands and run them in the Query Tool to create the tables and default admin.

6. **Connect to Database**
   - Go to `server/index.js` (or `.env` file).
     
   - Update the `user`, `password`, and `database` fields to match your local PostgreSQL credentials.

7. **Run the Project**
   - Start Backend: `nodemon index.js`
   - Start Frontend: `npm run dev`

## 🔑 Login Credentials

**Admin Login:**
- Username: admin
- Password: admin123

**User Login:**
- Username: testuser
- Password: user123
