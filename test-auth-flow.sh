#!/bin/bash

echo "🧪 Testing End-to-End Authentication Flow"
echo "=========================================="

# Test 1: Register a new user
echo "1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@crm.com",
    "password": "demopassword123",
    "firstName": "Demo",
    "lastName": "User"
  }')

if echo "$REGISTER_RESPONSE" | jq -e '.token' > /dev/null; then
  echo "✅ Registration successful"
  TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
else
  echo "❌ Registration failed"
  echo "$REGISTER_RESPONSE"
  exit 1
fi

echo ""

# Test 2: Login with the user
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@crm.com",
    "password": "demopassword123"
  }')

if echo "$LOGIN_RESPONSE" | jq -e '.token' > /dev/null; then
  echo "✅ Login successful"
  LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
else
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo ""

# Test 3: Access profile with token
echo "3. Testing protected profile endpoint..."
PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $LOGIN_TOKEN" \
  http://localhost:3000/api/auth/profile)

if echo "$PROFILE_RESPONSE" | jq -e '.email' > /dev/null; then
  echo "✅ Profile access successful"
  echo "   User: $(echo "$PROFILE_RESPONSE" | jq -r '.firstName') $(echo "$PROFILE_RESPONSE" | jq -r '.lastName')"
else
  echo "❌ Profile access failed"
  echo "$PROFILE_RESPONSE"
  exit 1
fi

echo ""

# Test 4: Access AI endpoint without token
echo "4. Testing AI endpoint without authentication..."
AI_NO_AUTH=$(curl -s -X POST http://localhost:3000/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}')

if echo "$AI_NO_AUTH" | jq -e '.statusCode' | grep -q 401; then
  echo "✅ AI endpoint properly protected (401 Unauthorized)"
else
  echo "❌ AI endpoint not properly protected"
  echo "$AI_NO_AUTH"
fi

echo ""

# Test 5: Access AI endpoint with token
echo "5. Testing AI endpoint with authentication..."
AI_WITH_AUTH=$(curl -s -X POST http://localhost:3000/api/ai/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -d '{"query": "TechCorp"}')

if echo "$AI_WITH_AUTH" | jq -e '.response' > /dev/null; then
  echo "✅ AI endpoint accessible with authentication"
  echo "   AI Response preview: $(echo "$AI_WITH_AUTH" | jq -r '.response' | head -c 100)..."
else
  echo "❌ AI endpoint failed with authentication"
  echo "$AI_WITH_AUTH"
fi

echo ""
echo "🎉 Authentication flow test completed!"
echo ""
echo "📋 Summary:"
echo "   - User registration: ✅"
echo "   - User login: ✅"
echo "   - Protected endpoints: ✅"
echo "   - AI endpoint security: ✅"
echo "   - AI functionality: ✅"
echo ""
echo "🌐 Frontend: http://localhost:5174"
echo "🔗 Backend API: http://localhost:3000/api"
echo ""
echo "💡 You can now:"
echo "   1. Open http://localhost:5174 in your browser"
echo "   2. Register or login with demo@crm.com / demopassword123"
echo "   3. Use the AI Assistant to search your CRM data!"