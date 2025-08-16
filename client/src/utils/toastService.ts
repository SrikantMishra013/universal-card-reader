import { showToast } from "../components/Toast"; // Adjust path as needed

// The toastService object with methods to show different types of toasts
const toastService = {
  /**
   * Displays a success toast notification.
   * @param message The message to display in the toast.
   */
  success: (message: string) => {
    showToast({ message, type: "success" });
  },
  /**
   * Displays an error toast notification.
   * @param message The message to display in the toast.
   */
  error: (message: string) => {
    showToast({ message, type: "error" });
  },
  /**
   * Displays an informational toast notification.
   * @param message The message to display in the toast.
   */
  info: (message: string) => {
    showToast({ message, type: "info" });
  },
};

export default toastService;
