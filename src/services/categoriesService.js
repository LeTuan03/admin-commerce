import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/categories";

export const getCategoriess = () => axios.get(URL);
export const getCategoriesById = (id) => axios.get(URL + "/" + id);
export const updateCategories = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteCategories = (id) => axios.delete(URL + "/" + id);
export const createCategories = (payload) => axios.post(URL, payload);