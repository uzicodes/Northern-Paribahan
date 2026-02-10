import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const verifyAuth = async (req: NextRequest) => {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        return decoded;
    } catch (error) {
        return null;
    }
};

export const signToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "1d",
    });
};
