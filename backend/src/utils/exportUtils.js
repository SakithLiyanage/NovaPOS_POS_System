const generateCSV = (data, columns) => {
  const headers = columns.map(col => col.label).join(',');
  
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Handle nested properties
      if (col.key.includes('.')) {
        value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
      }
      
      // Format value
      if (col.format === 'currency') {
        value = parseFloat(value || 0).toFixed(2);
      } else if (col.format === 'date') {
        value = new Date(value).toISOString().split('T')[0];
      }
      
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value ?? '';
    }).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

const generateReceiptHTML = (sale, settings) => {
  const itemsHTML = sale.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
      <td style="text-align: right;">$${item.lineTotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: monospace; font-size: 12px; width: 300px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
        .items { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .items td { padding: 4px 0; }
        .totals { border-top: 1px dashed #000; padding-top: 10px; }
        .total-row { display: flex; justify-content: space-between; }
        .grand-total { font-weight: bold; font-size: 14px; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>${settings?.storeName || 'NovaPOS'}</h2>
        <p>${settings?.storeAddress || ''}</p>
        <p>${settings?.storePhone || ''}</p>
      </div>
      
      <p>Invoice: ${sale.invoiceNo}</p>
      <p>Date: ${new Date(sale.createdAt).toLocaleString()}</p>
      <p>Cashier: ${sale.cashier?.name || 'N/A'}</p>
      
      <table class="items">
        <tr>
          <th style="text-align: left;">Item</th>
          <th>Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
        ${itemsHTML}
      </table>
      
      <div class="totals">
        <div class="total-row"><span>Subtotal:</span><span>$${sale.subtotal.toFixed(2)}</span></div>
        ${sale.discount > 0 ? `<div class="total-row"><span>Discount (${sale.discount}%):</span><span>-$${sale.discountAmount.toFixed(2)}</span></div>` : ''}
        <div class="total-row"><span>Tax:</span><span>$${sale.taxAmount.toFixed(2)}</span></div>
        <div class="total-row grand-total"><span>TOTAL:</span><span>$${sale.grandTotal.toFixed(2)}</span></div>
      </div>
      
      <p>Payment: ${sale.paymentMethod}</p>
      
      <div class="footer">
        <p>${settings?.receiptFooter || 'Thank you for your purchase!'}</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = { generateCSV, generateReceiptHTML };
