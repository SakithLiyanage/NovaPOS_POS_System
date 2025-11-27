export const printReceipt = (content) => {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          margin: 0;
          padding: 20px;
          width: 280px;
        }
        .header { text-align: center; margin-bottom: 20px; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; margin: 5px 0; }
        .total { font-weight: bold; font-size: 14px; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; }
        @media print {
          body { width: 100%; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `);

  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export const generateReceiptHTML = (sale, settings = {}) => {
  const { storeName = 'NovaPOS', storeAddress = '', storePhone = '', receiptFooter = 'Thank you!' } = settings;

  const itemsHTML = sale.items.map(item => `
    <div class="row">
      <span>${item.name}</span>
    </div>
    <div class="row">
      <span>${item.quantity} x $${item.unitPrice.toFixed(2)}</span>
      <span>$${item.lineTotal.toFixed(2)}</span>
    </div>
  `).join('');

  return `
    <div class="header">
      <h2 style="margin: 0;">${storeName}</h2>
      ${storeAddress ? `<p style="margin: 5px 0;">${storeAddress}</p>` : ''}
      ${storePhone ? `<p style="margin: 5px 0;">${storePhone}</p>` : ''}
    </div>
    
    <div class="divider"></div>
    
    <div class="row">
      <span>Invoice:</span>
      <span>${sale.invoiceNo}</span>
    </div>
    <div class="row">
      <span>Date:</span>
      <span>${new Date(sale.createdAt).toLocaleString()}</span>
    </div>
    <div class="row">
      <span>Cashier:</span>
      <span>${sale.cashier?.name || 'N/A'}</span>
    </div>
    
    <div class="divider"></div>
    
    ${itemsHTML}
    
    <div class="divider"></div>
    
    <div class="row">
      <span>Subtotal:</span>
      <span>$${sale.subtotal.toFixed(2)}</span>
    </div>
    ${sale.discount > 0 ? `
      <div class="row">
        <span>Discount (${sale.discount}%):</span>
        <span>-$${sale.discountAmount.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="row">
      <span>Tax:</span>
      <span>$${sale.taxAmount.toFixed(2)}</span>
    </div>
    <div class="row total">
      <span>TOTAL:</span>
      <span>$${sale.grandTotal.toFixed(2)}</span>
    </div>
    
    <div class="divider"></div>
    
    <div class="row">
      <span>Payment:</span>
      <span>${sale.paymentMethod}</span>
    </div>
    
    <div class="footer">
      <p>${receiptFooter}</p>
    </div>
  `;
};
