const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Search keyword
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const filter = { ...keyword };

    if (req.query.category) {
      let categories = req.query.category;
      if (!Array.isArray(categories)) categories = [categories];
      const categoryDocs = await Category.find({ name: { $in: categories.map(c => new RegExp(c, 'i')) } });
      const categoryIds = categoryDocs.map(c => c._id);
      if (categoryIds.length > 0) {
        filter.category = { $in: categoryIds };
      } else {
        filter.category = null; // No match
      }
    }

    if (req.query.brand) {
      let brands = req.query.brand;
      if (!Array.isArray(brands)) brands = [brands];
      filter.brand = { $in: brands.map(b => new RegExp(b, 'i')) };
    }

    if (req.query.tags) {
      let tags = req.query.tags;
      if (!Array.isArray(tags)) tags = [tags];
      filter.tags = { $in: tags };
    }

    if (req.query.petType) {
      let pets = req.query.petType;
      if (!Array.isArray(pets)) pets = [pets];
      filter.petType = { $in: pets };
    }

    // Filter by Price range
    const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
    const maxPrice = req.query.maxPrice ? { price: { ...minPrice.price, $lte: Number(req.query.maxPrice) } } : minPrice;
    const priceFilter = req.query.minPrice || req.query.maxPrice ? maxPrice : {};

    Object.assign(filter, priceFilter);

    let sortOpt = { name: 1 }; // Default sort by name A-Z
    if (req.query.sort === 'latest') {
      sortOpt = { createdAt: -1 };
    } else if (req.query.sort === 'price') {
      sortOpt = { price: 1 };
    } else if (req.query.sort === 'popularity') {
      sortOpt = { rating: -1, numReviews: -1 };
    } else if (req.query.sort === 'name') {
      sortOpt = { name: 1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort(sortOpt)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('brand', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    let categoryId = req.body.categoryId;
    if (!categoryId) {
      const defaultCategory = await Category.findOne();
      categoryId = defaultCategory ? defaultCategory._id : null;
    }

    const product = new Product({
      name: req.body.name || 'Sample name',
      price: req.body.price || 0,
      description: req.body.description || 'Sample description',
      image: req.body.image || '/images/sample.jpg',
      brand: req.body.brand || 'Sample brand',
      category: categoryId,
      stock: req.body.stock || 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
