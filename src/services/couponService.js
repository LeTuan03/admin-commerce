import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/coupons";

export const getCoupons = () => axios.get(URL);
export const getCouponById = (id) => axios.get(URL + "/" + id);
export const updateCoupon = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteCoupon = (id) => axios.delete(URL + "/" + id);
export const createCoupon = (payload) => axios.post(URL, payload);