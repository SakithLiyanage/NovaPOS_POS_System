import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showInfo = (message) => {
    toast(message, { icon: 'ℹ️' });
  };

  const showWarning = (message) => {
    toast(message, { icon: '⚠️' });
  };

  const showLoading = (message) => {
    return toast.loading(message);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const showPromise = (promise, { loading, success, error }) => {
    return toast.promise(promise, { loading, success, error });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    showPromise,
  };
};

export default useToast;
