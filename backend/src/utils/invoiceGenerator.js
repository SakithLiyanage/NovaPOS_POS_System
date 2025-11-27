const Settings = require('../models/Settings');

const generateInvoiceNumber = async (session = null) => {
  const options = session ? { session } : {};
  
  let settings = await Settings.findOne(options);
  
  if (!settings) {
    settings = await Settings.create([{
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1001,
    }], options);
    settings = settings[0];
  }
  
  const invoiceNo = `${settings.invoicePrefix}-${String(settings.nextInvoiceNumber).padStart(6, '0')}`;
  
  await Settings.findByIdAndUpdate(
    settings._id,
    { $inc: { nextInvoiceNumber: 1 } },
    options
  );
  
  return invoiceNo;
};

module.exports = { generateInvoiceNumber };
