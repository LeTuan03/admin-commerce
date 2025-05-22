import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/galleries";

export const getProductGallerys = () => axios.get(URL);
export const getProductGalleryById = (id) => axios.get(URL + "/" + id);
export const updateProductGallery = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteProductGallery = (id) => axios.delete(URL + "/" + id);
export const createProductGallery = (payload) => axios.post(URL, payload);