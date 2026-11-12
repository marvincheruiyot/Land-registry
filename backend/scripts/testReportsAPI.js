const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test the reports API endpoints
async function testReportsAPI() {
  try {
    console.log('🧪 Testing Reports API Endpoints...\n');
    
    // Test statistics endpoint
    console.log('1. Testing /reports/statistics endpoint...');
    const statsRes = await axios.get(`${BASE_URL}/reports/statistics`);
    console.log('   ✅ Statistics Response:', statsRes.data);
    console.log('');
    
    // Test detailed data endpoint
    console.log('2. Testing /reports/detailed endpoint...');
    const detailedRes = await axios.get(`${BASE_URL}/reports/detailed`);
    console.log('   ✅ Detailed Data Response:');
    console.log('   - Registrations:', detailedRes.data.data.registrations.length);
    console.log('   - Transfers:', detailedRes.data.data.transfers.length);
    console.log('   - Verifications:', detailedRes.data.data.verifications.length);
    console.log('');
    
    // Test analytics endpoint
    console.log('3. Testing /reports/analytics endpoint...');
    const analyticsRes = await axios.get(`${BASE_URL}/reports/analytics`);
    console.log('   ✅ Analytics Response:', JSON.stringify(analyticsRes.data, null, 2));
    console.log('');
    
    console.log('✅ ALL TESTS PASSED!\n');
  } catch (error) {
    console.error('❌ Test Error:', error.response?.data || error.message);
  }
}

testReportsAPI();
