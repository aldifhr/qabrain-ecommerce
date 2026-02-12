import "dotenv/config";

export const BASE_URL = process.env.BASE_URL || 'https://practice.qabrains.com/ecommerce';

export const user = {
    email: process.env.EMAIL || 'test@qabrains.com',
    password: process.env.PASSWORD || 'Password123'
};