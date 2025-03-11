import { Request, Response, NextFunction } from "express";
import {auth} from '../config/firebaseConfig';

export interface AuthRequest extends Request {
    user?: {
        uid: string,
        email: string
    }
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized - Missing or invalid token format' });
            return;
        }
        
        const token = authHeader.split('Bearer ')[1];
        
        if (!token) {
            res.status(401).json({ error: 'Unauthorized - No token provided' });
            return; 
        }

        // Verifikasi token Firebase
        const decodedToken = await auth.verifyIdToken(token);
        
        if (!decodedToken) {
            res.status(401).json({ error: 'Unauthorized - Invalid token' });
            return;
        }

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
        };
          
        next();
    } catch(error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
        
    }
}