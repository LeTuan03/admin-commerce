import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/product-attribute-values";

export const getProductAttributeValues = () => axios.get(URL);
export const getProductAttributeValueById = (id) => axios.get(URL + "/" + id);
export const updateProductAttributeValue = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteProductAttributeValue = (id) => axios.delete(URL + "/" + id);
export const createProductAttributeValue = (payload) => axios.post(URL, payload);