import axios from "axios";
import { toast } from "react-toastify";

export const getFinancialYear = (): string => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  if (month >= 4) {
    return `${year} - ${(year + 1).toString().slice(2)}`;
  } else {
    return `${year - 1} - ${year.toString().slice(2)}`;
  }
};

export const handleError = (error: any, containerId = "layout") => {
  if (axios.isAxiosError(error)) {
    var err = error.response;
    if (Array.isArray(err?.data.errors)) {
      for (let val of err?.data.errors) {
        toast.warning(val.description, { containerId: containerId });
      }
    } else if (typeof err?.data.errors === "object") {
      for (let e in err?.data.errors) {
        toast.warning(err.data.errors[e][0], { containerId: containerId });
      }
    } else if (err?.status == 401) {
      toast.warning("Please login", { containerId: containerId });
      localStorage.removeItem("sales_pulse_user");
      location.assign("/login");
    } else if (err?.data.message) {
      toast.warning(err.data.message, { containerId: containerId });
    } else if (err) {
      toast.warning(err?.data, { containerId: containerId });
    }
  }
};
