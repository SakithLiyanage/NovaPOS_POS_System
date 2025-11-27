import api from './api';

const exportService = {
  exportSales: async (params = {}) => {
    const response = await api.get('/export/sales', {
      params,
      responseType: 'blob',
    });
    return response;
  },

  exportProducts: async () => {
    const response = await api.get('/export/products', {
      responseType: 'blob',
    });
    return response;
  },

  getReceipt: async (saleId) => {
    const response = await api.get(`/export/receipt/${saleId}`);
    return response.data;
  },

  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  printReceipt: async (saleId) => {
    const html = await exportService.getReceipt(saleId);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  },
};

export default exportService;
