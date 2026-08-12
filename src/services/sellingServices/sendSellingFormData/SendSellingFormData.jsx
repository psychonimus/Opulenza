import axios from "axios";
import api from "../../../http-common";

export const SendSellingFormData = (dataObj) => {
    return api.post("/api/item/ItemRequest", dataObj);
}