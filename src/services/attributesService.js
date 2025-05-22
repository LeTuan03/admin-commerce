import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/attributes";

export const getAttributes = () => axios.get(URL);
export const getAttributeById = (id) => axios.get(URL + "/" + id);
export const updateAttribute = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteAttribute = (id) => axios.delete(URL + "/" + id);
export const createAttribute = (payload) => axios.post(URL, payload);
