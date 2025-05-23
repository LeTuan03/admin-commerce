import {PATH} from "../utils/constant.js";
import axios from "axios";

const URL = PATH + "/api/orders";

export const getOrders = () => axios.get(URL);
export const getOrdersById = (id) => axios.get(URL + "/" + id);
export const updateOrders = (id, payload) => axios.put(URL + "/" + id, payload);
export const deleteOrders = (id) => axios.delete(URL + "/" + id);
export const createOrders = (payload) => axios.post(URL, payload);


export const updateStatusOrders = (orderId, statusId) => axios.put(URL + "/" + orderId + "/status/" + statusId);
export const updateOrderDates = (orderId, payload) => axios.put(URL + "/" + orderId + "/dates", payload);
