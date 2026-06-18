import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set");
    }
    return secret;
};

export const verifyAuth = async (req: NextRequest) => {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        return decoded;
    } catch (error) {
        return null;
    }
};

export const signToken = (payload: object) => {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: "1d",
    });
};
