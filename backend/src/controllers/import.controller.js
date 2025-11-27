const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

const importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const content = req.file.buffer.toString('utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const errors = [];
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      try {
        // Validate required fields
        if (!row.name || !row.sku || !row.saleprice) {
          errors.push(`Row ${i + 1}: Missing required fields (name, sku, salePrice)`);
          continue;
        }

        // Find or create category
        let categoryId = null;
        if (row.category) {
          let category = await Category.findOne({ name: new RegExp(`^${row.category}$`, 'i') });
          if (!category) {
            category = await Category.create({ name: row.category });
          }
          categoryId = category._id;
        }

        // Find or create brand
        let brandId = null;
        if (row.brand) {
          let brand = await Brand.findOne({ name: new RegExp(`^${row.brand}$`, 'i') });
          if (!brand) {
            brand = await Brand.create({ name: row.brand });
          }
          brandId = brand._id;
        }

        products.push({
          name: row.name,
          sku: row.sku.toUpperCase(),
          barcode: row.barcode || null,
          category: categoryId,
          brand: brandId,
          costPrice: parseFloat(row.costprice) || 0,
          salePrice: parseFloat(row.saleprice),
          taxRate: parseFloat(row.taxrate) || 0,
          currentStock: parseInt(row.currentstock) || 0,
          lowStockThreshold: parseInt(row.lowstockthreshold) || 10,
        });
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    if (errors.length > 0 && products.length === 0) {
      return res.status(400).json({ message: 'Import failed', errors });
    }

    // Bulk insert with upsert
    const result = await Product.bulkWrite(
      products.map(p => ({
        updateOne: {
          filter: { sku: p.sku },
          update: { $set: p },
          upsert: true,
        },
      }))
    );

    res.json({
      success: true,
      imported: result.upsertedCount + result.modifiedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { importProducts };
