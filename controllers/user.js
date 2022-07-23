import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message: "User doesn't exist"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credetnials."});

        const token = jwt.sign({ _id: existingUser._id}, 'test', { expiresIn: "1h"});

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        res.status(200).json({ success: true,
                               message: 'Login success'});


    } catch (error) {
        res.status(500).json({message: 'Something went wrong'});
    }
}

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword} = req.body;
    console.log(req.body);

    try {
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).josn({message: "User already exists"});

        if( password !== confirmPassword) return res.status(400).json({ message: "Passwords dont match."});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`});

        // const {password, ...data} = await result.toJSON();
        
        const token = jwt.sign({ _id: result._id}, 'test', { expiresIn: "1h"});


        res.status(200).json({ result: result, token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong'});

    }
}

export const signout = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 0});

    res.send({
        success: true,
        message: 'Logged out successfully!'
    })
}