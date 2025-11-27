/**
 * This script generates JSDoc type definitions from Mongoose models
 * Run with: node scripts/generate-types.js
 */

const fs = require('fs');
const path = require('path');

const typeDefinitions = `
/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {'OWNER' | 'MANAGER' | 'CASHIER'} role
 * @property {boolean} isActive
 * @property {Date} [lastLogin]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} sku
 * @property {string} [barcode]
 * @property {string} [category]
 * @property {string} [brand]
 * @property {number} costPrice
 * @property {number} salePrice
 * @property {number} taxRate
 * @property {number} currentStock
 * @property {number} lowStockThreshold
 * @property {string} [imageUrl]
 * @property {boolean} isActive
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} SaleItem
 * @property {string} product
 * @property {string} name
 * @property {string} [sku]
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} taxRate
 * @property {number} lineTotal
 */

/**
 * @typedef {Object} Sale
 * @property {string} _id
 * @property {string} invoiceNo
 * @property {string} cashier
 * @property {string} [customer]
 * @property {SaleItem[]} items
 * @property {number} subtotal
 * @property {number} discount
 * @property {number} discountAmount
 * @property {number} taxAmount
 * @property {number} grandTotal
 * @property {'CASH' | 'CARD' | 'OTHER'} paymentMethod
 * @property {'COMPLETED' | 'REFUNDED' | 'CANCELLED'} status
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Customer
 * @property {string} _id
 * @property {string} name
 * @property {string} [phone]
 * @property {string} [email]
 * @property {string} [notes]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} [description]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Brand
 * @property {string} _id
 * @property {string} name
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Settings
 * @property {string} storeName
 * @property {string} [storeAddress]
 * @property {string} [storePhone]
 * @property {string} [storeEmail]
 * @property {string} currency
 * @property {string} currencySymbol
 * @property {number} taxRate
 * @property {string} invoicePrefix
 * @property {number} nextInvoiceNumber
 * @property {boolean} showProductImages
 * @property {boolean} lowStockWarning
 * @property {string} [receiptFooter]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [message]
 * @property {Object} [pagination]
 */
`;

const outputPath = path.join(__dirname, '..', 'frontend', 'src', 'types', 'index.js');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, typeDefinitions);
console.log('Type definitions generated at:', outputPath);
