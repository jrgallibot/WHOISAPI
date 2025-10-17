# Whois Lookup Application

A modern, responsive full-stack application for domain and contact information lookup using the WhoisXML API.

## Project Structure

```
TLV300-WHOISAPI/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # Application entry point
│   │   ├── types.ts        # TypeScript type definitions
│   │   ├── utils.ts        # Utility functions
│   │   └── styles.css      # Application styles
│   ├── package.json        # Node.js dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite build configuration
├── env/                    # Python virtual environment
├── .gitignore             # Git ignore rules
├── env.example            # Environment variables template
├── README.md              # Project documentation
└── API_DOCUMENTATION.md   # API reference documentation
```

## Features

- **🌐 Domain Information Lookup** - Get registrar, registration date, expiration date, age, and name servers
- **👤 Contact Information Lookup** - Retrieve registrant, technical, and administrative contact details
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **🌙 Dark Mode Support** - Automatically adapts to your system preference
- **💾 Database Logging** - Optional MySQL logging of all lookups
- **🔄 Recent Searches** - Remembers your last 5 searched domains
- **⚡ Modern UI** - Beautiful gradient design with smooth animations
- **🎯 Smart UX** - Enter key support, loading states, and helpful hints

## Technology Stack

### Backend
- **Python 3.10+** - Core programming language
- **Flask 3.0.0** - Web framework
- **Requests 2.32.3** - HTTP client library
- **python-dotenv 1.0.1** - Environment variable management
- **mysqlclient 2.2.4** - MySQL database connector (optional)

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript 5.5.4** - Type-safe JavaScript
- **Vite 5.4.2** - Build tool and dev server
- **Modern CSS** - Custom styling with gradients and animations

### Database
- **MySQL** - Optional logging database
- **Supabase** - Not used in this project

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TLV300-WHOISAPI
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your WhoisXML API key
   ```

3. **Set up Python backend**
   ```bash
   # Create virtual environment
   python -m venv env
   
   # Activate virtual environment
   # Windows:
   .\env\Scripts\Activate.ps1
   # Linux/macOS:
   source env/bin/activate
   
   # Install dependencies
   pip install -r backend/requirements.txt
   ```

4. **Set up React frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

5. **Run the application**
   ```bash
   # Start the backend server
   python backend/app.py
   ```

6. **Access the application**
   Open your browser and navigate to: http://localhost:5000

## Development

### Backend Development
The Flask backend runs on port 5000 by default. It includes:
- Comprehensive logging
- Error handling
- Optional MySQL integration
- Well-documented API endpoints

### Frontend Development
For frontend development with hot reload:
```bash
cd frontend
npm run dev
```

This runs the frontend on port 5173 with API proxy to the backend.

### Code Quality
The codebase follows best practices:
- **TypeScript** for type safety
- **Comprehensive documentation** with docstrings
- **Error handling** and logging
- **Modular structure** with separated concerns
- **Clean code** with meaningful variable names

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section in the README
2. Review the API documentation
3. Check the server logs for detailed error messages
4. Create an issue with detailed information
