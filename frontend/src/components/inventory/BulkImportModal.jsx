import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BulkImportModal = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (formData) => api.post('/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['products']);
      toast.success(`Imported ${res.data.imported} products`);
      handleClose();
    },
    onError: (err) => {
      setErrors(err.response?.data?.errors || ['Import failed']);
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(csv|xlsx?)$/i)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setErrors([]);

    // Parse preview (simplified - in production use proper CSV parser)
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(0, 6);
      setPreview(lines.map(line => line.split(',')));
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    importMutation.mutate(formData);
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setErrors([]);
    onClose();
  };

  const downloadTemplate = () => {
    const template = 'name,sku,barcode,category,brand,costPrice,salePrice,taxRate,currentStock,lowStockThreshold\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Import Products" size="lg">
      <div className="space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 cursor-pointer transition-colors"
        >
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{file ? file.name : 'Click to upload or drag and drop'}</p>
          <p className="text-sm text-gray-500 mt-1">CSV or Excel files supported</p>
        </div>

        <button onClick={downloadTemplate} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <FileSpreadsheet className="w-4 h-4" />
          Download template
        </button>

        {preview && (
          <div className="overflow-auto max-h-48 border rounded-lg">
            <table className="min-w-full text-sm">
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-gray-100 font-medium' : ''}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 border-b">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {errors.length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <AlertCircle className="w-5 h-5" />
              Import Errors
            </div>
            <ul className="text-sm text-red-600 list-disc list-inside">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
          <Button onClick={handleImport} loading={importMutation.isLoading} disabled={!file} className="flex-1">
            Import Products
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkImportModal;
