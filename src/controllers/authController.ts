import {Request, Response} from 'express'
import {db} from '../db/connection';
import {users} from '../db/schemas/userSchema';

import {generateToken} from '../utils/jwt';
import {hashPassword, comparePassword} from '../utils/passwords';

import {eq} from 'drizzle-orm';

//register
export const register = async (req: Request, res: Response) => {
    try {
        const {email, username, password} = req.body;
        const hashedPassword = await hashPassword(password);

        const [user] = await db.insert(users).values({
            email,
            username,
            password: hashedPassword,

        }).returning({
            
                id: users.id,
                email: users.email,
                username: users.username,
        });

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        });

        res.status(201).json({message: 'User registered successfully', token });


    }catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

//login 
export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        const user = await db.query.users.findFirst({
            where: eq(users.username, username)
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        });

        res.status(201).json({ message: 'Login successful', token, user: {
            id: user.id,
            username: user.username,
            email: user.email,
        } });

    }catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}