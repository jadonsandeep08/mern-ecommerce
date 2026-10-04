const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Dummy products inserted successfully");

        process.exit();
    } catch (error) {
        console.error(`Seeder Error: ${error.message}`);
        process.exit(1);
    }
};

importData();