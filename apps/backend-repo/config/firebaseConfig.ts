import * as admin from "firebase-admin"

const serviceAccount = {
    type: "service_account",
    project_id: "ebuddy-project-e87d0",
    private_key_id: "f770281ee7db0e6128cb0bfe7785ccb2ce8ca06c",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBhFcZnEvQYiHR\nN/jfyy0N1wJdnIezAPmcH/+ZhOM3NZ0Aq0jx3WpVWrP2RQBquff357/ymXHkXMT/\n5S9Wj3MHcQuuN3FzRlz+0jy3CzZwSa/9wJbOrjMDTZErT2mmNlVYlstjW3f1CqbI\nUV1ScERCPjIiGRk0Kv7+GktPpiLh2wP4dh6KbSfjVRV1N7UxMlDVQbIIJT5JcQYE\nHNvK5HSj2wpAcIuD7EKqtu5Nw1wZh5rXqIfz5DgABI9Jlf6BhyxdTG9wE6dIliqW\ng1kPTySCoMMwSJoB/LLQ+eoLtv1Mp4ayGJg9ZXxYKuvA9oAKdpLiOra3uY3gGYtw\nLDJb3Bh3AgMBAAECggEADK9oJj2gmqBUJyrMHZ9r7KRTe19vZcSCmEFgt+eGHXBe\nQlT4CyLAfafcdCBBzr0yDAYdBwIX/Sg3oa6cU8hDehFm+pyXyz6piequIDGT9/hc\nmP2u5Q12OpkzEuu5uTOGlLAN1Q2B54YzOJ5cx7KkRtNc5e9PP6Qx4uZGWYpCbxuW\n1yDVL5yGXHXd6Xr3fGcNer2lJfQxfvyO1Rn1JZMEO3yKu9aYFVI+do+z+7GoRyYN\nNk/0iJZSmlUhljcR4xljqPXnvi/Cfg0vS7080v7msQDny/AkpI5rqIO6uJVQpwA+\n9znCE5D5nbvbI8EDzmyttS9EZjooOnevhOqH0B/hQQKBgQD8Am5fCx41gkY0p7+P\neIPUEbfc8kd+2UJmsjwl7tsQbwYVZ0ZrqEnY7iyY2VXiBFNnB8Pk87vMRghUST5k\n9jV2PhSs8VAsnyumf2S5i+R56lEm9k11nJeas0/vRZ92ocK2PIDL09BsW7+vkYTt\nKorUOM9jKZllvc8F+Fg8JZF6ZQKBgQDElMxgmmEu3TsSa7BX0JrUX7eatfcMAESu\neeAZhb18IbeBdXNOV+uaUG8CTXocmOD+KLt4EDI97A6WzzNc3wbwnmjR+7HMydo6\nJKynIINa/Oxnf5YK2Yhb37n+zqu2jzC7/eR5JTqnLxoj5U3YgnRRYZ1JsX01ru3r\nNmUUkGkLqwKBgQDzhd3mFjZQ+tyg0WE5YPnzGlQUPEN+fq+90YpyFYi3LrIwSKYy\nLmN+L1oFMi/dwtRdgZF5U1YspZgy6rxSj+FFq+QK4v3YwM9Li1toOZjFfvqArg5Y\nEsQliBU8YIkh+FrSA1FqpfqIW3i2Tean0C5ruaIebvp+6JZ/bGbHaH5WSQKBgQCI\nG35mZH1lNUfxOR6fro+E+8DkHZkvdgAXzcqb4T2Q9MdZmzh6xeUasxYpQfuKUU92\nqj0ipBQlS4vOXyfw5XqonwV0XhB8+kVefIYOMTTBit0jy/LXEEaZVg4xnmbFv96+\nSswmFODHYJV4xQthHPHsZunAXGOVB8kzUjYqRtJ0gQKBgClqjk85uE3xEGjUe64i\nCTiFVD1/OM6jHEhTH2nf2U49Ntmfq99nMAzqxFfDPrwmiwQ3ULmu6UQi/g54Fagk\nUG2aK5/dDlEk3RKuW9Cfk26tqgqJRhtXY7z/oPTxvtzAISwTcdjOOC6YTda//mYC\nEdmpq3lxIEqCm9DKSRrP2TCm\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@ebuddy-project-e87d0.iam.gserviceaccount.com",
    client_id: "107867769475710176145",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ebuddy-project-e87d0.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

// Check if running in emulator
const FIREBASE_EMULATOR = process.env.FUNCTIONS_EMULATOR === 'true';

if (!admin.apps.length) {
    // Configure firebase differently based on environment
    if (FIREBASE_EMULATOR) {
        // For emulator, use a minimal config
        admin.initializeApp();
        
        // If using Firestore emulator, configure it
        if (process.env.FIRESTORE_EMULATOR_HOST) {
            admin.firestore().settings({
                host: process.env.FIRESTORE_EMULATOR_HOST,
                ssl: false
            });
        }
    } else {
        // For production, use the service account
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
        });
    }
}


export const db = admin.firestore();
export const auth = admin.auth();

export default admin;