const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected for seeding...'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await Restaurant.deleteMany();
        await FoodItem.deleteMany();

        const restaurants = [
            {
                name: 'The Burger Club',
                description: 'Gourmet burgers and artisanal sides. The ultimate comfort food destination.',
                address: 'Banjara Hills, Hyderabad',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
                isActive: true,
                category: 'Burgers, American'
            },
            {
                name: 'Spice Garden',
                description: 'Authentic Hyderabadi Biryani and North Indian delicacies cooked with passion.',
                address: 'Gachibowli, Hyderabad',
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
                isActive: true,
                category: 'North Indian, Biryani'
            },
            {
                name: 'Pizza Roma',
                description: 'Stone-fired pizzas with imported Italian ingredients and fresh basil.',
                address: 'Jubilee Hills, Hyderabad',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
                isActive: true,
                category: 'Pizza, Italian'
            },
            {
                name: 'Dragon Wok',
                description: 'Sizzling Chinese favorites and authentic dim sums from across Asia.',
                address: 'Madhapur, Hyderabad',
                image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
                isActive: true,
                category: 'Chinese, Asian'
            },
            {
                name: 'Green Leaf Cafe',
                description: 'Organic, healthy, and high-protein meals for the fitness enthusiasts.',
                address: 'Kondapur, Hyderabad',
                image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800',
                isActive: true,
                category: 'Salad, Healthy'
            }
        ];

        const createdRestaurants = await Restaurant.insertMany(restaurants);
        console.log('Restaurants seeded!');

        const foodItems = [];

        
        foodItems.push(
            { restaurantId: createdRestaurants[0]._id, name: 'Monster Cheese Burger', price: 299, category: 'Recommended', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[0]._id, name: 'Crunchy Chicken Wings', price: 199, category: 'Snacks', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[0]._id, name: 'Peri Peri Fries', price: 129, category: 'Sides', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800', isAvailable: true }
        );

        
        foodItems.push(
            { restaurantId: createdRestaurants[1]._id, name: 'Hyderabadi Chicken Biryani', price: 349, category: 'Recommended', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[1]._id, name: 'Butter Chicken', price: 289, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[1]._id, name: 'Garlic Naan', price: 45, category: 'Breads', image: 'https://images.unsplash.com/photo-1601303584126-269420658827?auto=format&fit=crop&q=80&w=800', isAvailable: true }
        );

        
        foodItems.push(
            { restaurantId: createdRestaurants[2]._id, name: 'Double Cheese Margherita', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[2]._id, name: 'Pepperoni Feast', price: 449, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[2]._id, name: 'Garlic Breadsticks', price: 149, category: 'Sides', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=800', isAvailable: true }
        );

        
        foodItems.push(
            { restaurantId: createdRestaurants[3]._id, name: 'Hakama Noodles', price: 229, category: 'Main Course', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[3]._id, name: 'Chicken Manchurian', price: 249, category: 'Starters', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[3]._id, name: 'Steamed Veg Momos', price: 159, category: 'Recommended', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b4?auto=format&fit=crop&q=80&w=800', isAvailable: true }
        );

        
        foodItems.push(
            { restaurantId: createdRestaurants[4]._id, name: 'Greek Salad', price: 279, category: 'Salads', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[4]._id, name: 'Avocado Toast', price: 329, category: 'Recommended', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800', isAvailable: true },
            { restaurantId: createdRestaurants[4]._id, name: 'Fruit Bowl', price: 199, category: 'Snacks', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', isAvailable: true }
        );

        await FoodItem.insertMany(foodItems);
        console.log('Food Items seeded!');

        
        await User.deleteMany({ email: 'admin@foodexpress.com' });
        await User.create({
            name: 'Master Admin',
            email: 'admin@foodexpress.com',
            password: 'admin123', 
            role: 'admin'
        });
        console.log('Admin User seeded! (admin@foodexpress.com / admin123)');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
