import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/customers";

export const getCustomers = () => axios.get(URL);
export const getCustomerById = (id) => axios.get(URL + "/" + id);
export const updateCustomer = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteCustomer = (id) => axios.delete(URL + "/" + id);
export const createCustomer = (payload) => axios.post(URL, payload);