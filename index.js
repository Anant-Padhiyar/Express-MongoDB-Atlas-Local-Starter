const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3001;

const uri = "";
// Create a ProductDB Database & ProductsList Collection in Atlas

// Insert Object with Modal ,Price key value Pairs manually & try this API

// Define a route for viewing all ProductsList
app.get('/ProductsList', async (req, res) => {
    try {
        // Connect to MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('ProductDB');
        const collection = database.collection('ProductsList');

        // Query for all documents in the collection
        const result = await collection.find({}, { projection: { Modal: 1, _id: 0 } }).toArray();
        const modals = result.map(item => item.Modal);

        // Close the connection
        await client.close();

        return res.json(modals);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Define a route for viewing all Products
app.get('/Products', async (req, res) => {
    try {
        // Connect to MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('ProductDB');
        const collection = database.collection('ProductsList');

        // Query for all documents in the collection
        const result = await collection.find({}).limit(6).toArray();
  
        // Close the connection
        await client.close();

        return res.json(result);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Define a route for viewing a specific product by its id
app.get('/Products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Connect to MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('ProductDB');
        const collection = database.collection('Products');

        // Query for the product with the given id
        const existingProduct = await collection.findOne({ Modal: id });

        // Close the connection
        await client.close();

        if (existingProduct) {
            return res.json(existingProduct);
        } else {
            return res.status(404).json({ error: "Product Not Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//Brand 

app.get('/ProductsByBrand/:brand', async (req, res) => {
    let client; // Declare client variable outside the try block
    try {
        const brand = req.params.brand; // Get the brand from URL parameters

        // Connect to MongoDB
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('ProductDB');
        const collection = database.collection('ProductsList');

        // Limit the number of products to 20 where brand matches the one provided in the request
     const regex = new RegExp(brand,'i');
     const products = await collection.find({ Modal: { $regex: regex } }).limit(20).toArray();
  
        return res.json(products);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        // Close the connection after the operation is complete
        if (client) {
            await client.close();
        }
    }
});

// Search By Modal Return All Ram & color Versions

app.get('/ProductsByModal/:Modal', async (req, res) => {
    let client; // Declare client variable outside the try block
    try {
        const modal = req.params.Modal; // Get the modal name from URL parameters

        // Connect to MongoDB
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('ProductDB');
        const collection = database.collection('ProductsList');

        // Perform a case-insensitive search for products whose modal name includes the provided modal
        const regex = new RegExp(modal,'i');
        const products = await collection.find({ Modal: { $regex: regex } }).limit(21).toArray();

        // Return the matching products
        return res.status(200).json({products});
 
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        // Close the connection after the operation is complete
        if (client) {
            await client.close();
        }
    }
});

// Price
app.get('/ProductsByPrice/:Price', async (req, res) => {
    let client; // Declare client variable outside the try block
    try {
        const Price = req.params.Price; // Get the brand from URL parameters

        // Connect to MongoDB
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db('ProductDB');
        const collection = database.collection('ProductsList');

        // Query for products with a price less than or equal to the provided price
        const products = await collection.find({ Price: { $lte: parseFloat(Price) } }).sort({ Price: -1 }).limit(33).toArray();

        return res.json(products);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        // Close the connection after the operation is complete
        if (client) {
            await client.close();
        }
    }
});


app.listen(PORT, () => console.log(`Server Started At PORT :${PORT}`));
module.exports = app;
