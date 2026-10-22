const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Service = require('./models/Service');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Coupon = require('./models/Coupon');
const PetProfile = require('./models/PetProfile');
const Review = require('./models/Review');
const Appointment = require('./models/Appointment');

dotenv.config();

const categories = [
  { name: 'Cat Food', count: 24 },
  { name: 'Bowls', count: 33 },
  { name: 'Clothes', count: 52 },
  { name: 'Food', count: 34 },
  { name: 'Toys', count: 21 },
  { name: 'Beds', count: 37 }
];

const brands = ['Natural pet', 'Pet spa', 'Dogs food', 'Whiskas', 'Meow pet', 'Snack mix'];
const tagsList = ['Dog food', 'Cat food', 'Natural', 'Sweet', 'Small dog', 'Cat'];
const pets = ['Cat', 'Hamster', 'Dog', 'Parrot', 'Rabbit', 'Turtle'];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected for seeding...');

    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Service.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Coupon.deleteMany();
    await PetProfile.deleteMany();
    await Review.deleteMany();
    await Appointment.deleteMany();
    
    const createdCategories = {};
    for (const cat of categories) {
      const newCat = await Category.create({ name: cat.name, description: `Description for ${cat.name}` });
      createdCategories[cat.name] = newCat._id;
    }

    const createdBrands = {};
    for (const b of brands) {
      const newBrand = await Brand.create({ name: b, description: `Quality pet products from ${b}` });
      createdBrands[b] = newBrand._id;
    }

    // Seed some basic services
    await Service.insertMany([
      { name: 'Dog Grooming Basic', description: 'Bath, brush, and nail trim', price: 35, durationMinutes: 60 },
      { name: 'Cat Grooming Basic', description: 'Bath and brush out', price: 40, durationMinutes: 45 },
      { name: 'Pet Hotel (1 Night)', description: 'Overnight stay with food included', price: 25, durationMinutes: 1440 }
    ]);

    const productsToInsert = [];
    
    // Generate exactly the number of products per category
    for (const cat of categories) {
      for (let i = 0; i < cat.count; i++) {
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        const randomPet = pets[Math.floor(Math.random() * pets.length)];
        
        // Pick 1-3 random tags
        const numTags = Math.floor(Math.random() * 3) + 1;
        const shuffledTags = [...tagsList].sort(() => 0.5 - Math.random());
        const randomTags = shuffledTags.slice(0, numTags);
        
        productsToInsert.push({
          name: `${cat.name} Item ${i + 1}`,
          description: `High quality ${cat.name} for your beloved pet.`,
          price: Math.floor(Math.random() * 90) + 10,
          image: '/images/sample.jpg',
          category: createdCategories[cat.name],
          stock: Math.floor(Math.random() * 100) + 10,
          rating: Math.floor(Math.random() * 5) + 1,
          numReviews: Math.floor(Math.random() * 50),
          brand: createdBrands[randomBrand],
          tags: randomTags,
          petType: randomPet,
          images: ['/images/sample.jpg']
        });
      }
    }

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Data Imported! Total products: ${createdProducts.length}`);

    // Create Dummy Users
    const adminUser = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' });
    const customerUser = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password', role: 'customer' });

    // Seed Pet Profiles
    const pet1 = await PetProfile.create({ user: customerUser._id, name: 'Rex', type: 'Dog', breed: 'Golden Retriever', age: 2, weight: 15 });
    const pet2 = await PetProfile.create({ user: customerUser._id, name: 'Whiskers', type: 'Cat', breed: 'Siamese', age: 1, weight: 4 });
    console.log('Seeded Pet Profiles!');

    // Seed Services again (already done, but fetch one to use)
    const services = await Service.find();

    // Seed Appointments
    await Appointment.create({ user: customerUser._id, pet: pet1._id, service: services[0]._id, date: new Date('2026-11-01T10:00:00Z'), status: 'Confirmed' });
    await Appointment.create({ user: customerUser._id, pet: pet2._id, service: services[1]._id, date: new Date('2026-11-02T14:30:00Z'), status: 'Pending' });
    console.log('Seeded Appointments!');

    // Seed Coupons
    const coupon = await Coupon.create({ code: 'SUMMER20', discountPercentage: 20, expiryDate: new Date('2027-01-01T00:00:00Z') });
    console.log('Seeded Coupons!');

    // Seed Carts
    await Cart.create({
      user: customerUser._id,
      items: [
        { product: createdProducts[0]._id, quantity: 2, variantInfo: 'Large' },
        { product: createdProducts[1]._id, quantity: 1 }
      ]
    });
    console.log('Seeded Carts!');

    // Seed Reviews
    await Review.create({ user: customerUser._id, product: createdProducts[0]._id, rating: 5, comment: 'Amazing product!' });
    await Review.create({ user: customerUser._id, product: createdProducts[1]._id, rating: 4, comment: 'Good quality, my cat loves it.' });
    console.log('Seeded Reviews!');

    // Seed Orders
    await Order.create({
      user: customerUser._id,
      orderItems: [
        { name: createdProducts[0].name, qty: 1, image: createdProducts[0].image, price: createdProducts[0].price, product: createdProducts[0]._id }
      ],
      shippingAddress: { address: '123 Main St', city: 'Hanoi', postalCode: '100000', country: 'Vietnam' },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: createdProducts[0].price,
      taxPrice: 0,
      shippingPrice: 10,
      totalPrice: createdProducts[0].price + 10,
      couponCode: 'SUMMER20',
      discountAmount: 0, // Simplified for seed
      isPaid: false,
      isDelivered: false
    });
    console.log('Seeded Orders!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
