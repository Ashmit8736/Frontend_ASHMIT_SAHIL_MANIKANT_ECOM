// src/api/supplierApi.js
import api from "../utils/axiosInstance";

export const registerSupplier = async (data) => {
  return await api.post("/auth/supplier/register", data);
};

export const supplierSendOtp = async (phone) => {
  return await api.post("/auth/supplier/register-send-otp", { phone });
};

export const supplierVerifyOtp = async (phone, otp) => {
  return await api.post("/auth/supplier/register-verify-otp", { phone, otp });
};

export const supplierLogin = async (data) => {
  return await api.post("/auth/supplier/login", data);
};

export const getSupplierData = async () => {
  return await api.get("/auth/supplier/supplier-data");
};
