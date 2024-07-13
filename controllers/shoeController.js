const redisClient = require('../config/redisClient');

// Get shoe by ID
const getShoeById = async (req, res) => {
    const shoeId = req.params.id;
    const shoeKey = `shoe:${shoeId}`;

    try {
        let shoe = await redisClient.get(shoeKey);
        if (shoe) {
            res.json(JSON.parse(shoe));
        } else {
            res.status(404).json({ message: `Shoe with id ${shoeId} not found.` });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all shoes
const getAllShoes = async (req, res) => {
    try {
        const shoeKeys = await redisClient.keys('shoe:*');
        const shoeData = await Promise.all(shoeKeys.map(async key => {
            let data = await redisClient.get(key);
            return JSON.parse(data);
        }));
        res.json(shoeData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new shoe
const addShoe = async (req, res) => {
    const shoesKeyPrefix = 'shoe:';
    const { id, ...shoe } = req.body;
    const shoeKey = `${shoesKeyPrefix}${id}`;

    try {
        await redisClient.set(shoeKey, JSON.stringify({ id, ...shoe }));
        res.send('Shoe added');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing shoe
const updateShoe = async (req, res) => {
    const shoeId = req.params.id;
    const shoeKey = `shoe:${shoeId}`;

    try {
        let existingShoe = await redisClient.get(shoeKey);
        if (existingShoe) {
            const updatedShoe = { ...JSON.parse(existingShoe), ...req.body };
            await redisClient.set(shoeKey, JSON.stringify(updatedShoe));
            res.json(updatedShoe);
        } else {
            res.status(404).json({ message: `Shoe with id ${shoeId} not found.` });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a shoe by ID
const deleteShoe = async (req, res) => {
    const shoeId = req.params.id;
    const shoeKey = `shoe:${shoeId}`;

    try {
        let result = await redisClient.del(shoeKey);
        if (result === 1) {
            res.json({ message: `Shoe with id ${shoeId} was deleted.` });
        } else {
            res.status(404).json({ message: `Shoe with id ${shoeId} not found.` });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Search for shoes by name
const searchShoes = async (req, res) => {
    const searchTerm = req.query.searchTerm.toLowerCase();

    try {
        const keys = await redisClient.keys('shoe:*');
        const relevantShoes = await Promise.all(keys.map(async key => {
            const shoe = JSON.parse(await redisClient.get(key));
            if (shoe.name.toLowerCase().includes(searchTerm)) {
                return shoe;
            }
        }));
        res.json(relevantShoes.filter(Boolean));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getShoeById,
    getAllShoes,
    addShoe,
    updateShoe,
    deleteShoe,
    searchShoes
};
