import api from "../../http-common";

export const AddBid = (payload) => {
    return api.post("api/itembid/AddBid", payload);
}

