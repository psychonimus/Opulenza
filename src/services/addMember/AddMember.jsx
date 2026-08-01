import axios from "axios";
import api from "../../http-common";

export const addMember = (dataObj) => {
    return api.post("/api/member/AddAdminMember", dataObj);
}