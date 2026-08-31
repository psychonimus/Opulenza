import api from "../../http-common";

export const AddBid = (payload) => {
    return api.post("api/itembid/AddBid", payload);
}


export const getLatestBid = (itemId) => {
    return api.get(`api/itembid/latest-bids/${itemId}`);
}
