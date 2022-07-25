import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(200).json({
            message: "User doesn't exist",
            success: false
        });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(200).json({
            message: "Invalid credetnials.",
            success: false
        });

        const token = jwt.sign({ _id: existingUser._id}, 'test', { expiresIn: "1h"});

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(200).json({ success: true,
                               message: 'Login success',
                               result: existingUser,
                               token});


    } catch (error) {
        res.status(500).json({message: 'Something went wrong'});
    }
}

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword} = req.body;
    console.log(req.body);

    try {
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(200).json({
            message: "User already exists",
            success: false
        });

        if( password !== confirmPassword) return res.status(200).json({ 
            message: "Passwords dont match.",
            success: false
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`});

        // const {password, ...data} = await result.toJSON();
        
        const token = jwt.sign({ _id: result._id}, 'test', { expiresIn: "1h"});

        console.log(result);
        res.status(200).json({ 
            result: result,
             token: token,
            success: true,
            message: 'Registration success'});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong'});

    }
}

export const signout = async (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge: 0});

        res.send({
            success: true,
            message: 'Logged out successfully!'
        })
    } catch(err) {
        console.log(err);
        res.send({
            success: false,
            message: 'Something went wrong!'
        })
    }
    
}