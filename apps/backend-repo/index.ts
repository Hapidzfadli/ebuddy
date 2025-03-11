import * as functions from 'firebase-functions';
import app from './core/app';

// Export the Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);

// Only run the standalone server if not in Firebase Functions environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  // Create a function to try different ports if the preferred one is busy
  const startServer = (port: number) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error('Server error:', e);
      }
    });
  };
  
  startServer(5000);
}