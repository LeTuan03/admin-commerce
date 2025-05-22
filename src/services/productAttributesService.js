import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/product-attributes";

export const getProductAttributes = () => axios.get(URL);
export const getProductAttributeById = (id) => axios.get(URL + "/" + id);
export const updateProductAttribute = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteProductAttribute = (id) => axios.delete(URL + "/" + id);
export const createProductAttribute = (payload) => axios.post(URL, payload);