#!/bin/bash

# Script để test với mock Kling API
# Chạy mock server và main server + worker

echo "🚀 Starting Mock Kling API Test..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Creating from env.example..."
  cp env.example .env
  echo "✅ Created .env file"
  echo ""
fi

# Set mock mode in .env
if ! grep -q "USE_MOCK_KLING=true" .env; then
  echo "Setting USE_MOCK_KLING=true in .env..."
  if grep -q "USE_MOCK_KLING" .env; then
    sed -i 's/USE_MOCK_KLING=.*/USE_MOCK_KLING=true/' .env
  else
    echo "USE_MOCK_KLING=true" >> .env
  fi
  echo "✅ Mock mode enabled"
  echo ""
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Starting services..."
echo ""

# Start mock server in background
echo "1️⃣  Starting Mock Kling Server (port 3002)..."
node mockKlingServer.js &
MOCK_PID=$!

# Wait a bit for mock server to start
sleep 2

# Start main server in background
echo "2️⃣  Starting Main Server (port 3001)..."
node server.js &
SERVER_PID=$!

# Wait a bit for main server to start
sleep 2

# Start worker in background
echo "3️⃣  Starting Worker..."
node worker.js &
WORKER_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "📝 Services:"
echo "   - Mock Kling API: http://localhost:3002"
echo "   - Main Server:   http://localhost:3001"
echo "   - Worker:        Running"
echo ""
echo "🧪 Test endpoints:"
echo "   POST http://localhost:3001/api/dancing/create-job"
echo "   GET  http://localhost:3001/api/dancing/job-status/:job_id"
echo ""
echo "📊 Mock Kling Debug:"
echo "   GET  http://localhost:3002/mock/tasks"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping all services...'; kill $MOCK_PID $SERVER_PID $WORKER_PID 2>/dev/null; exit" INT

# Keep script running
wait


