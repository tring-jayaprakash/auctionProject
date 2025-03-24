// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { Request, Response, NextFunction } from "express";
// import { Any } from "typeorm";

// dotenv.config();

// export function authMiddleware(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.split(" ")[1];

//     if (!token) {
//         req.user = null;
//         return next();
//     }

//     try {
//         const decodedUser = jwt.verify(token, process.env.SECRET_KEY!);
//         req.user = decodedUser; // Attach user to request
//     } catch (err) {
//         req.user = null; // Invalid token
//     }

//     next();
// }
