"""
Whois Lookup API Backend

A Flask-based REST API that provides domain and contact information lookup
using the WhoisXML API service. Features optional MySQL logging for analytics.

Author: TLV300-WHOISAPI
License: MIT
"""

import os
import logging
from typing import Any, Dict, List, Optional

import requests
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration constants
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")
WHOIS_API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService"

# Load environment variables from .env if present
load_dotenv()

# Initialize Flask application
app = Flask(
    __name__,
    static_folder=FRONTEND_DIST_DIR,
    static_url_path="",
)


def get_env(key: str, default: Optional[str] = None) -> Optional[str]:
    """
    Get environment variable with optional default value.
    
    Args:
        key: Environment variable name
        default: Default value if key not found
        
    Returns:
        Environment variable value or default
    """
    return os.environ.get(key, default)


def truncate_text(value: str, max_length: int = 25) -> str:
    """
    Truncate text to specified length with ellipsis.
    
    Args:
        value: Text to truncate
        max_length: Maximum length before truncation
        
    Returns:
        Truncated text with ellipsis if needed
    """
    if not isinstance(value, str):
        return ""
    if len(value) <= max_length:
        return value
    return value[: max_length - 3] + "..."


def normalize_hostnames(record: Dict[str, Any]) -> str:
    """
    Extract and normalize hostnames from WHOIS record.
    
    Args:
        record: WHOIS record dictionary
        
    Returns:
        Comma-separated list of truncated hostnames
    """
    hostnames: List[str] = []

    def extract_hostnames(container: Dict[str, Any]) -> List[str]:
        """Extract hostnames from a container object."""
        if not container:
            return []
        name_servers = container.get("nameServers") or {}
        if not isinstance(name_servers, dict):
            return []
        hosts = name_servers.get("hostNames")
        if isinstance(hosts, list):
            return [str(h) for h in hosts]
        if isinstance(hosts, str):
            return [h.strip() for h in hosts.replace(",", " ").split() if h.strip()]
        raw = name_servers.get("rawText")
        if isinstance(raw, str):
            return [h.strip() for h in raw.replace(",", " ").split() if h.strip()]
        return []

    # Try primary record, then registryData
    hostnames = extract_hostnames(record)
    if not hostnames:
        registry_data = record.get("registryData") or {}
        if isinstance(registry_data, dict):
            hostnames = extract_hostnames(registry_data)

    if not hostnames:
        return ""

    truncated = [truncate_text(h) for h in hostnames]
    return ", ".join(truncated)


def extract_domain_information(record: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract domain information from WHOIS record.
    
    Args:
        record: WHOIS record dictionary
        
    Returns:
        Dictionary containing domain information
    """
    registry_data = record.get("registryData") or {}
    if not isinstance(registry_data, dict):
        registry_data = {}

    def pick(*keys: str) -> Optional[str]:
        """Pick first non-empty value from record or registry_data."""
        for k in keys:
            v = record.get(k)
            if v:
                return v
            v = registry_data.get(k)
            if v:
                return v
        return None

    domain_name = pick("domainName") or ""
    registrar = (
        pick("registrarName")
        or ((record.get("registrar") or {}).get("name") if isinstance(record.get("registrar"), dict) else None)
        or ""
    )
    created = pick("createdDate") or ""
    expires = pick("expiresDate") or ""
    estimated_age = pick("estimatedDomainAge")
    hostnames = normalize_hostnames(record)

    return {
        "domainName": domain_name,
        "registrar": registrar,
        "registrationDate": created,
        "expirationDate": expires,
        "estimatedDomainAge": estimated_age,
        "hostnames": hostnames,
    }


def extract_contact_information(record: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract contact information from WHOIS record.
    
    Args:
        record: WHOIS record dictionary
        
    Returns:
        Dictionary containing contact information
    """
    registrant = record.get("registrant") if isinstance(record.get("registrant"), dict) else {}
    tech = record.get("technicalContact") if isinstance(record.get("technicalContact"), dict) else {}
    admin = record.get("administrativeContact") if isinstance(record.get("administrativeContact"), dict) else {}

    return {
        "registrantName": registrant.get("name") or "",
        "technicalContactName": tech.get("name") or "",
        "administrativeContactName": admin.get("name") or "",
        "contactEmail": record.get("contactEmail") or registrant.get("email") or "",
    }


# Optional MySQL logging via MySQLdb (mysqlclient)
try:
    import MySQLdb  # type: ignore
    MYSQL_AVAILABLE = True
    logger.info("MySQL logging enabled")
except Exception:  # pragma: no cover
    MySQLdb = None  # type: ignore
    MYSQL_AVAILABLE = False
    logger.info("MySQL logging disabled - mysqlclient not available")


def get_db_config() -> Optional[Dict[str, Any]]:
    """
    Get MySQL database configuration from environment variables.
    
    Returns:
        Database configuration dictionary or None if not configured
    """
    if not MYSQL_AVAILABLE:
        return None
    host = get_env("MYSQL_HOST")
    user = get_env("MYSQL_USER")
    password = get_env("MYSQL_PASSWORD")
    db = get_env("MYSQL_DB")
    port = int(get_env("MYSQL_PORT", "3306") or 3306)
    if all([host, user, db]):  # password can be empty
        return {"host": host, "user": user, "passwd": password or "", "db": db, "port": port, "charset": "utf8mb4"}
    return None


def get_db_connection():
    """
    Get MySQL database connection.
    
    Returns:
        MySQL connection object or None if connection fails
    """
    cfg = get_db_config()
    if not cfg:
        return None
    try:
        return MySQLdb.connect(**cfg)  # type: ignore
    except Exception as e:
        logger.error(f"Failed to connect to MySQL: {e}")
        return None


def init_db():
    """
    Initialize MySQL database tables.
    Creates whois_lookups table if it doesn't exist.
    """
    conn = get_db_connection()
    if not conn:
        logger.info("Skipping database initialization - no MySQL connection")
        return
    try:
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS whois_lookups (
              id INT AUTO_INCREMENT PRIMARY KEY,
              domain VARCHAR(255) NOT NULL,
              info_type ENUM('domain','contact') NOT NULL,
              http_status INT NOT NULL,
              success TINYINT(1) NOT NULL,
              registrar VARCHAR(255) NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """
        )
        conn.commit()
        logger.info("Database table 'whois_lookups' initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
    finally:
        try:
            conn.close()
        except Exception:
            pass


def log_lookup(domain: str, info_type: str, http_status: int, success: bool, registrar: Optional[str] = None) -> None:
    """
    Log WHOIS lookup to MySQL database.
    
    Args:
        domain: Domain name that was looked up
        info_type: Type of information requested ('domain' or 'contact')
        http_status: HTTP status code from API response
        success: Whether the lookup was successful
        registrar: Registrar name (optional)
    """
    conn = get_db_connection()
    if not conn:
        return
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO whois_lookups (domain, info_type, http_status, success, registrar)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (domain, info_type, http_status, int(bool(success)), registrar or None),
        )
        conn.commit()
        logger.debug(f"Logged lookup: {domain} ({info_type}) - Status: {http_status}")
    except Exception as e:
        logger.error(f"Failed to log lookup: {e}")
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.post("/api/whois")
def whois_lookup():
    """
    WHOIS lookup API endpoint.
    
    Performs domain or contact information lookup using WhoisXML API.
    Supports both JSON POST and query parameter requests.
    
    Request Body (JSON):
        {
            "domain": "example.com",
            "type": "domain" | "contact"
        }
        
    Query Parameters:
        domain: Domain name to lookup
        type: Information type ("domain" or "contact")
        
    Returns:
        JSON response with lookup results or error message
        
    Status Codes:
        200: Successful lookup
        400: Invalid request parameters
        404: Domain not found
        500: Server configuration error
        502: Upstream API error
        504: Request timeout
    """
    try:
        # Parse request data from JSON body or query parameters
        payload = request.get_json(silent=True) or {}
        domain = (payload.get("domain") or request.args.get("domain") or "").strip()
        info_type = (payload.get("type") or request.args.get("type") or "").strip().lower()

        # Validate input parameters
        if not domain:
            logger.warning("WHOIS lookup request missing domain parameter")
            return jsonify({"error": "Missing 'domain'"}), 400
        if info_type not in ("domain", "contact"):
            logger.warning(f"WHOIS lookup request with invalid type: {info_type}")
            return jsonify({"error": "Invalid 'type'. Use 'domain' or 'contact'"}), 400

        # Check API key configuration
        api_key = get_env("WHOIS_API_KEY")
        if not api_key:
            logger.error("WHOIS_API_KEY not configured")
            return jsonify({"error": "Server not configured with WHOIS_API_KEY"}), 500

        logger.info(f"Processing WHOIS lookup: {domain} ({info_type})")

        # Prepare API request parameters
        params = {
            "apiKey": api_key,
            "domainName": domain,
            "outputFormat": "JSON",
        }
        
        # Make request to WhoisXML API
        resp = requests.get(WHOIS_API_URL, params=params, timeout=20)

        if resp.status_code != 200:
            logger.error(f"WhoisXML API error: {resp.status_code} - {resp.text[:100]}")
            log_lookup(domain, info_type, resp.status_code, False)
            return (
                jsonify(
                    {
                        "error": "Upstream whois service error",
                        "status": resp.status_code,
                        "details": resp.text[:300],
                    }
                ),
                502,
            )

        # Parse API response
        data = resp.json()
        record = data.get("WhoisRecord") or {}
        if not record:
            logger.warning(f"No WHOIS record found for domain: {domain}")
            log_lookup(domain, info_type, 404, False)
            return jsonify({"error": "Whois record not found for domain"}), 404

        # Extract relevant information based on request type
        if info_type == "domain":
            result = extract_domain_information(record)
            registrar_for_log = result.get("registrar")
        else:
            result = extract_contact_information(record)
            registrar_for_log = (record.get("registrar") or {}).get("name") if isinstance(record.get("registrar"), dict) else None

        # Log successful lookup
        log_lookup(domain, info_type, 200, True, registrar_for_log)
        logger.info(f"Successful WHOIS lookup: {domain} ({info_type})")
        
        return jsonify({"domain": domain, "type": info_type, "data": result})

    except requests.Timeout:
        logger.error(f"WHOIS lookup timeout for domain: {request.args.get('domain', '')}")
        log_lookup(request.args.get("domain") or "", request.args.get("type") or "", 504, False)
        return jsonify({"error": "Upstream whois request timed out"}), 504
    except Exception as exc:  # pylint: disable=broad-except
        logger.error(f"Unexpected error in WHOIS lookup: {exc}")
        log_lookup("", "", 500, False)
        return jsonify({"error": "Unexpected server error", "details": str(exc)}), 500


@app.get("/")
@app.get("/<path:path>")
def serve_spa(path: Optional[str] = None):
    """
    Serve Single Page Application (SPA) routes.
    
    Serves static files from the built frontend directory.
    Falls back to index.html for SPA routes to enable client-side routing.
    
    Args:
        path: Optional file path to serve
        
    Returns:
        Static file or index.html for SPA routing
    """
    # Serve static files from the built frontend; fallback to index.html for SPA routes
    dist_dir = FRONTEND_DIST_DIR
    if path:
        candidate = os.path.join(dist_dir, path)
        if os.path.isfile(candidate):
            return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")


if __name__ == "__main__":
    """
    Application entry point.
    
    Initializes database tables and starts the Flask development server.
    """
    port = int(get_env("PORT", "5000"))
    logger.info(f"Starting WHOIS Lookup API server on port {port}")
    
    # Initialize database tables
    init_db()
    
    # Start Flask development server
    app.run(host="0.0.0.0", port=port, debug=True)


