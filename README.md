# 🔍 Whois Lookup Full-Stack App

A modern, responsive full-stack application that provides domain and contact information lookup using the WhoisXML API. Features a beautiful React frontend with a Python Flask backend and optional MySQL logging.

## ✨ Features

- **🌐 Domain Information Lookup** - Get registrar, registration date, expiration date, age, and name servers
- **👤 Contact Information Lookup** - Retrieve registrant, technical, and administrative contact details
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **🌙 Dark Mode Support** - Automatically adapts to your system preference
- **💾 Database Logging** - Optional MySQL logging of all lookups
- **🔄 Recent Searches** - Remembers your last 5 searched domains
- **⚡ Modern UI** - Beautiful gradient design with smooth animations
- **🎯 Smart UX** - Enter key support, loading states, and helpful hints

## 🛠️ Tech Stack

- **Backend**: Python 3.10+ + Flask
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: MySQL (optional)
- **Styling**: Modern CSS with gradients and animations
- **API**: WhoisXML API integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **MySQL** (optional) - [Download MySQL](https://dev.mysql.com/downloads/)
- **Git** - [Download Git](https://git-scm.com/downloads)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd TLV300-WHOAMAPI
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Required: WhoisXML API key
WHOIS_API_KEY=your_whoisxml_api_key_here

# Optional: Flask server port (default 5000)
PORT=5000

# Optional: MySQL logging configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=whois_logs
```

**Get your free WhoisXML API key:**
1. Visit [WhoisXML API](https://whoisxmlapi.com/)
2. Sign up for a free account
3. Go to Settings → API Key
4. Copy your API key to the `.env` file

### 3. Backend Setup

#### Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
# Create virtual environment
python -m venv env

# Activate virtual environment
.\env\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
# Create virtual environment
python -m venv env

# Activate virtual environment
env\Scripts\activate.bat
```

**Linux/macOS:**
```bash
# Create virtual environment
python -m venv env

# Activate virtual environment
source env/bin/activate
```

#### Install Python Dependencies

```bash
# Install backend dependencies
pip install -r backend/requirements.txt
```

#### Optional: MySQL Database Setup

If you want to enable database logging:

1. **Install MySQL** and start the service
2. **Create the database**:
   ```sql
   CREATE DATABASE whois_logs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Update `.env`** with your MySQL credentials
4. **Test connection** (optional):
   ```bash
   mysql -u root -p whois_logs
   ```

The application will automatically create the required tables on first run.

### 4. Frontend Setup

#### Install Node.js Dependencies

```bash
cd frontend
npm install
cd ..
```

#### Build the Frontend

```bash
cd frontend
npm run build
cd ..
```

### 5. Run the Application

#### Start the Backend Server

**Windows (PowerShell):**
```powershell
# Activate virtual environment
.\env\Scripts\Activate.ps1

# Set environment variables
$env:WHOIS_API_KEY="your_api_key_here"
$env:MYSQL_HOST="localhost"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_DB="whois_logs"
$env:MYSQL_PORT="3306"

# Run the application
python backend/app.py
```

**Windows (Command Prompt):**
```cmd
# Activate virtual environment
env\Scripts\activate.bat

# Set environment variables
set WHOIS_API_KEY=your_api_key_here
set MYSQL_HOST=localhost
set MYSQL_USER=root
set MYSQL_PASSWORD=your_password
set MYSQL_DB=whois_logs
set MYSQL_PORT=3306

# Run the application
python backend/app.py
```

**Linux/macOS:**
```bash
# Activate virtual environment
source env/bin/activate

# Set environment variables
export WHOIS_API_KEY="your_api_key_here"
export MYSQL_HOST="localhost"
export MYSQL_USER="root"
export MYSQL_PASSWORD="your_password"
export MYSQL_DB="whois_logs"
export MYSQL_PORT="3306"

# Run the application
python backend/app.py
```

#### Access the Application

Open your browser and navigate to: **http://localhost:5000**

#### Deactivate Virtual Environment (when done)

When you're finished working with the application:

**Windows:**
```cmd
deactivate
```

**Linux/macOS:**
```bash
deactivate
```

## 🎯 Usage

1. **Enter a domain name** (e.g., `google.com`, `github.com`)
2. **Select information type**:
   - 🌐 **Domain Info** - Registrar, dates, age, name servers
   - 👤 **Contact Info** - Registrant, technical, administrative contacts
3. **Click "Lookup"** or press **Enter**
4. **View results** in a beautifully formatted table

### Example Domains to Try

- `google.com` - Popular search engine
- `github.com` - Code hosting platform
- `stackoverflow.com` - Developer Q&A site
- `amazon.com` - E-commerce giant
- `microsoft.com` - Technology company

## 🔧 Development

### Frontend Development

For frontend development with hot reload:

```bash
cd frontend
npm run dev
```

This runs the frontend on port 5173 with API proxy to the backend.

### Backend Development

The backend runs on port 5000 by default. You can change this by setting the `PORT` environment variable.

### Database Development

To view logged lookups:

```sql
-- Connect to MySQL
mysql -u root -p whois_logs

-- View recent lookups
SELECT * FROM whois_lookups ORDER BY created_at DESC LIMIT 10;

-- View lookup statistics
SELECT 
  info_type,
  COUNT(*) as total_lookups,
  SUM(success) as successful_lookups
FROM whois_lookups 
GROUP BY info_type;
```

## 📊 API Documentation

### Endpoint: `POST /api/whois`

**Request Body:**
```json
{
  "domain": "example.com",
  "type": "domain"
}
```

**Parameters:**
- `domain` (string, required) - The domain name to lookup
- `type` (string, required) - Either "domain" or "contact"

**Response Examples:**

**Domain Information:**
```json
{
  "domain": "google.com",
  "type": "domain",
  "data": {
    "domainName": "google.com",
    "registrar": "MarkMonitor Inc.",
    "registrationDate": "1997-09-15T00:00:00Z",
    "expirationDate": "2028-09-14T00:00:00Z",
    "estimatedDomainAge": 11308,
    "hostnames": "ns1.google.com, ns2.google.com, ns3.google.com, ns4.google.com"
  }
}
```

**Contact Information:**
```json
{
  "domain": "google.com",
  "type": "contact",
  "data": {
    "registrantName": "Google LLC",
    "technicalContactName": "Google LLC",
    "administrativeContactName": "Google LLC",
    "contactEmail": "dns-admin@google.com"
  }
}
```

## 🗄️ Database Schema

### Table: `whois_lookups`

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT AUTO_INCREMENT | Primary key |
| `domain` | VARCHAR(255) | Domain name looked up |
| `info_type` | ENUM('domain','contact') | Type of information requested |
| `http_status` | INT | HTTP response status code |
| `success` | TINYINT(1) | Whether lookup was successful |
| `registrar` | VARCHAR(255) | Registrar name (when available) |
| `created_at` | TIMESTAMP | When the lookup was performed |

## 🚀 Deployment

### Local Deployment

The application is ready for local deployment on port 5000. The Flask backend serves both the API and the built React frontend as static files.

### Production Deployment

For production deployment:

1. **Use a production WSGI server** (e.g., Gunicorn, uWSGI)
2. **Set up a reverse proxy** (e.g., Nginx)
3. **Configure environment variables** securely
4. **Set up SSL/TLS** certificates
5. **Configure MySQL** for production use

**Example with Gunicorn:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
```

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot connect to backend server"**
- Ensure the virtual environment is activated: `.\env\Scripts\Activate.ps1` (Windows) or `source env/bin/activate` (Linux/macOS)
- Ensure the backend is running: `python backend/app.py`
- Check if port 5000 is available
- Verify environment variables are set correctly

**2. "Server not configured with WHOIS_API_KEY"**
- Check your `.env` file exists and contains the API key
- Verify the API key is valid and active

**3. "Database logging not working"**
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify the `whois_logs` database exists

**4. Frontend build errors**
- Ensure Node.js 18+ is installed
- Run `npm install` in the frontend directory
- Check for TypeScript errors

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WHOIS_API_KEY` | ✅ Yes | - | Your WhoisXML API key |
| `PORT` | ❌ No | 5000 | Flask server port |
| `MYSQL_HOST` | ❌ No | localhost | MySQL host |
| `MYSQL_PORT` | ❌ No | 3306 | MySQL port |
| `MYSQL_USER` | ❌ No | root | MySQL username |
| `MYSQL_PASSWORD` | ❌ No | - | MySQL password |
| `MYSQL_DB` | ❌ No | whois_logs | MySQL database name |

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information
4. Include error messages and steps to reproduce

---

**🎉 Enjoy using your Whois Lookup application!**
