import { BASE_URL } from "@/api/api";

import axios from "axios";
import { toast } from "react-toastify";

export const successToast = (message: string, type: "success" | "error") => {
  toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const uploadFile = async (file: File) => {
  // /api/images/upload this is route need to upload file to server as image form data multipart/form-data
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(BASE_URL + "/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data?.data?.original;
  } catch (error) {
    console.log(error);
    return null;
  }
};
