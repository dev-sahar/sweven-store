import Products from '../models/product-model.js';

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => '$' + match
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const ProductController = {
  getProducts: async (req, res) => {
    try {
      console.log(req.query);
      const features = new APIfeatures(Products.find(), req.query)
        .filter()
        .sort()
        .paginate();

      const products = await features.query;

      res.json({
        status: 'success',
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  addProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) return res.status(400).json({ msg: 'No image uploaded!' });

      const product = await Products.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: 'Product already exists!' });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save();

      res.json({ msg: 'Product added successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      await Products.findByIdAndDelete(id);

      res.json({ msg: 'Product deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images) return res.status(400).json({ msg: 'No image uploaded!' });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: 'Product updated successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

export default ProductController;
