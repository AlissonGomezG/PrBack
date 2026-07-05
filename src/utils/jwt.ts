import {SignJWT, jwtVerify, JWTPayload as JoseWTTPayload} from 'jose'
import {createSecretKey} from 'crypto'
import env from '../../env'


export interface CustomJWTPayload extends JoseWTTPayload {
    id: string; 
    email: string;
    username: string;
}


export const generateToken = async (payload: CustomJWTPayload) => {
    const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8');
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRES_IN)
        .sign(secretKey);

        return token;
};


export const verifyToken = async (token: string) => {
    const secretKey = createSecretKey(
        env.JWT_SECRET,
        "utf-8"
    );

    const { payload } = await jwtVerify(
        token,
        secretKey
    );

    return payload as CustomJWTPayload;
};