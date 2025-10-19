# Dreamery Backend API

Custom JWT Authentication Backend for Dreamery with anti-account-sharing measures.

## Features

- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Password hashing and validation
- ✅ Anti-account-sharing measures
- ✅ Session management
- ✅ Role-based access control
- ✅ Property analysis storage
- ✅ Deal management
- ✅ Security monitoring
- ✅ Docker deployment ready

## Quick Start

### Using Docker (Recommended)

1. Clone the repository and navigate to the backend directory
2. Copy the environment file:
   ```bash
   cp env.example .env
   ```
3. Update the `.env` file with your configuration
4. Start the services:
   ```bash
   docker-compose up -d
   ```

The API will be available at `http://localhost:8000`

### Manual Setup

1. Install Python 3.11+
2. Install PostgreSQL
3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Set up environment variables (copy from `env.example`)
6. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout-all` - Logout from all devices
- `GET /api/auth/me` - Get current user info

### Deals
- `POST /api/deals/` - Create new deal
- `GET /api/deals/` - Get user's deals
- `GET /api/deals/{deal_id}` - Get specific deal
- `PUT /api/deals/{deal_id}` - Update deal
- `DELETE /api/deals/{deal_id}` - Delete deal

### Property Analyses
- `POST /api/deals/analyses` - Create property analysis
- `GET /api/deals/analyses` - Get user's analyses

### Users
- `GET /api/users/me` - Get current user info
- `GET /api/users/sessions` - Get active sessions
- `POST /api/users/sessions/{session_id}/invalidate` - Invalidate session

## Security Features

### Anti-Account-Sharing Measures
- Device fingerprinting
- Session management with limits
- IP address monitoring
- Suspicious activity detection
- Automatic session invalidation

### Authentication Security
- Password strength validation
- Account lockout after failed attempts
- JWT token expiration
- Secure password hashing (bcrypt)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | JWT secret key | Required |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | 1440 |
| `ALLOWED_ORIGINS` | CORS allowed origins | Required |
| `MAX_CONCURRENT_SESSIONS` | Max concurrent sessions per user | 3 |
| `SESSION_DURATION_HOURS` | Session duration | 24 |

## Development

### Running Tests
```bash
pytest
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

### Code Formatting
```bash
black .
isort .
```

## Production Deployment

1. Update environment variables for production
2. Use a production WSGI server like Gunicorn
3. Set up reverse proxy (Nginx)
4. Configure SSL/TLS
5. Set up monitoring and logging
6. Use a managed database service

## License

Copyright (c) 2024 Dreamery Software LLC. All rights reserved.
