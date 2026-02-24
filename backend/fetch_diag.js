const axios = require('axios');
async function checkDiag() {
    try {
        const res = await axios.get('http://localhost:5000/api/auth/diag');
        console.log("=== ENROLLED JOURNEYS ===");
        console.log(JSON.stringify(res.data.enrolledJourneys, null, 2));
        console.log("=== CURRENT SECTION ID ===");
        console.log(res.data.currentSectionId);
    } catch (err) {
        console.error(err.message);
    }
}
checkDiag();
