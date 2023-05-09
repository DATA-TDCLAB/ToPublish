//APS_CLIENT_ID="DGZWJQI4QRVhOCFOMTUfAFjG7DloabU9"
//APS_CLIENT_SECRET="waG7axH7kfQOVZTe"
//APS_CALLBACK_URL="http://localhost:10000/api/auth/callback"
//SERVER_SESSION_SECRET="custom-encryption-phrase"
//PORT=10000


let { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_CALLBACK_URL, SERVER_SESSION_SECRET, PORT } = process.env;
if (!APS_CLIENT_ID || !APS_CLIENT_SECRET || !APS_CALLBACK_URL || !SERVER_SESSION_SECRET) {
    console.warn('Missing some of the environment variables.');
    process.exit(1);
}
const INTERNAL_TOKEN_SCOPES = ['data:read'];
const PUBLIC_TOKEN_SCOPES = ['viewables:read'];
PORT = PORT;



module.exports = {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_CALLBACK_URL,
    SERVER_SESSION_SECRET,
    INTERNAL_TOKEN_SCOPES,
    PUBLIC_TOKEN_SCOPES,
    PORT
};
