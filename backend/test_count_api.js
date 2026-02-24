const axios = require('axios');

async function testEndpoint() {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/auth/users/count');
        console.log("Response:", res.data);
    } catch (err) {
        if (err.response) {
            console.log("Error Status:", err.response.status);
            console.log("Error Data:", err.response.data);
        } else {
            console.log("Error Message:", err.message);
        }
    }
}

testEndpoint();
