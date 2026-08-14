import api from "../../http-common";

export const GiftForm = (dataObj) => {
    return api.post("/api/member/WelcomeGift", dataObj);
}