import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/products";

export const getProducts = () => axios.get(URL);
export const getProductById = (id) => axios.get(URL + "/" + id);
export const updateProduct = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteProduct = (id) => axios.delete(URL + "/" + id);
export const createProducts = (payload) => axios.post(URL, payload);