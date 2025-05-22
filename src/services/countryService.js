import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/countries";

export const getCountrys = () => axios.get(URL);
export const getCountryById = (id) => axios.get(URL + "/" + id);
export const updateCountry = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteCountry = (id) => axios.delete(URL + "/" + id);
export const createCountry = (payload) => axios.post(URL, payload);