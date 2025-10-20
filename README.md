# DREAMERY - Real Estate Platform

**DREAMERY - PRIVATE REPOSITORY**

A comprehensive real estate platform with custom JWT authentication backend and anti-account-sharing measures.

## Architecture

### Frontend (React + TypeScript)
- **React 18.2.0** with TypeScript 4.9.5
- **Material-UI v5.15.10** for modern UI components
- **Custom authentication** with device fingerprinting
- **Property analysis tools** and workspace management
- **Real-time data** and interactive maps with Apple Maps integration

### Backend (FastAPI + PostgreSQL)
- **FastAPI** with async support
- **PostgreSQL** database with SQLAlchemy ORM
- **JWT authentication** with comprehensive security
- **Anti-account-sharing** measures
- **RESTful API** with Swagger documentation

### Legacy Backend (Python Flask)
- **Python Flask** - Original API server
- **Prisma ORM** - Database toolkit
- **PostgreSQL/SQLite** - Database

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/Ben100mm/2.git
cd Ben100mm-DREAMERY
```

### 2. Start the New JWT Backend (Recommended)
```bash
cd backend
./start.sh
```

The backend will be available at:
- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### 3. Start the Legacy Backend (Alternative)
```bash
cd server
pip install -r requirements.txt
python start_realtor_api.py  # Backend (port 5001)
```

### 4. Start the Frontend
```bash
npm install
npm start
```

The frontend will be available at http://localhost:7001

## 🔐 Security Features

### Anti-Account-Sharing Measures
- ✅ **Device Fingerprinting** - Unique device identification
- ✅ **Session Management** - Track and limit concurrent sessions (max 3)
- ✅ **IP Monitoring** - Detect suspicious location changes
- ✅ **Security Events** - Log and monitor suspicious activity
- ✅ **Session Invalidation** - Force logout from all devices
- ✅ **Real-time Validation** - Continuous token validation

### Authentication Security
- ✅ **Password Hashing** - bcrypt with salt
- ✅ **Password Validation** - Strength requirements
- ✅ **Account Lockout** - After 5 failed attempts (30 min lockout)
- ✅ **JWT Tokens** - 24-hour expiration
- ✅ **Role-Based Access** - User, Admin, Premium roles

## Core Features

### User Management
- User registration and login
- Profile management
- Session monitoring
- Security event tracking

### Property Analysis
- Comprehensive deal analysis
- Property valuation tools
- Market analysis
- Investment calculations
- Save and manage analyses

### Workspace
- Personal workspace
- Saved deals and analyses
- Property search and filtering
- Data export capabilities

### User Roles
- **Buyer** - Individual homebuyers
- **Buying Agent** - Agents representing buyers
- **Listing Agent** - Agents representing sellers
- **Broker** - Office-level oversight
- **Brand Manager** - Multi-office management
- **Enterprise** - Large brokerage operations

## Development

### New JWT Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Legacy Backend Development
```bash
cd server
pip install -r requirements.txt
python start_realtor_api.py
```

### Frontend Development
```bash
npm install
npm start
```

### Running Tests
```bash
# New backend tests
cd backend
pytest

# Frontend tests
npm test
```

## Docker Deployment

### Full Stack Deployment
```bash
# New JWT Backend
cd backend
docker-compose up -d

# Frontend (separate terminal)
npm run build
# Deploy build folder to your hosting service
```

### Environment Configuration
Copy `backend/env.example` to `backend/.env` and configure:
- Database connection
- JWT secret key
- CORS origins
- Email settings (optional)

## API Documentation

### New JWT Backend Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user info
- `POST /api/deals/` - Create saved deal
- `GET /api/deals/` - Get user's deals
- `PUT /api/deals/{id}` - Update deal
- `DELETE /api/deals/{id}` - Delete deal
- `POST /api/deals/analyses` - Create analysis
- `GET /api/deals/analyses` - Get analyses

### Legacy Backend Endpoints
- Property scraping and analysis
- Real estate data integration
- Market analysis tools

## 🏢 Project Structure

```
├── backend/                 # New FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Security and auth
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/         # Utilities
│   ├── tests/              # Test files
│   ├── docker-compose.yml  # Docker setup
│   └── requirements.txt    # Python dependencies
├── server/                 # Legacy Python Flask backend
│   ├── core/              # Core functionality
│   ├── tests/             # Test files
│   └── requirements.txt   # Python dependencies
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── types/            # TypeScript types
├── docs/                 # Documentation
├── legal/                # Legal documents
└── prisma/               # Database schema
```

## Configuration

### New Backend Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dreamery_db
SECRET_KEY=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:7001"]
MAX_CONCURRENT_SESSIONS=3
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_APPLE_MAPS_JWT_TOKEN=your_jwt_token
```

## Performance & Scalability

- **Database:** PostgreSQL with connection pooling
- **Caching:** Redis for session management
- **API:** FastAPI with async support
- **Frontend:** React with code splitting
- **Security:** Rate limiting and input validation

## Production Deployment

### Backend
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy with Docker or directly with Python
4. Set up reverse proxy (Nginx)
5. Configure SSL/TLS

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to CDN or static hosting
3. Configure environment variables
4. Set up monitoring and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

Copyright (c) 2024 Dreamery Software LLC. All rights reserved.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the backend README in `backend/README.md`

## Access and Usage Restrictions

**AUTHORIZED PERSONNEL ONLY**

This is a **PRIVATE, PROPRIETARY REPOSITORY** with restricted access. Unauthorized access is strictly prohibited and may result in legal action.

### Authorized Access
- Full-time employees of Dreamery Software LLC
- Contractors with signed Non-Disclosure Agreements
- Partners with explicit written authorization
- Third-party developers with valid service agreements

### Prohibited Activities
- Copying, reproducing, or distributing any code
- Reverse engineering or decompiling software
- Creating competing products or services
- Sharing code with unauthorized parties
- Using proprietary information for personal gain

---

**Built for the real estate industry**
