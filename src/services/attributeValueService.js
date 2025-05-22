import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/attribute-values";

export const getAttributeValues = () => axios.get(URL);
export const getAttributeValueById = (id) => axios.get(URL + "/" + id);
export const updateAttributeValue = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteAttributeValue = (id) => axios.delete(URL + "/" + id);
export const createAttributeValue = (payload) => axios.post(URL, payload);