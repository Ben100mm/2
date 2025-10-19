#!/bin/bash

# Start the Dreamery Backend API

echo "🚀 Starting Dreamery Backend API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration before running again"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services with Docker Compose
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if backend is healthy
echo "🔍 Checking backend health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "✅ Backend is healthy!"
        break
    else
        echo "⏳ Attempt $attempt/$max_attempts - Backend not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Backend failed to start properly"
    echo "📋 Checking logs..."
    docker-compose logs backend
    exit 1
fi

echo ""
echo "🎉 Dreamery Backend API is running!"
echo "📍 API URL: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "🔧 ReDoc: http://localhost:8000/redoc"
echo ""
echo "To stop the services, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
