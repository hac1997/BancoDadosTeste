import { toast } from 'react-toastify';

export const showAlert = (message, type = 'info') => {
  const options = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'danger':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warn(message, options);
      break;
    case 'info':
    default:
      toast.info(message, options);
      break;
  }
};