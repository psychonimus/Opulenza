import api from "../../http-common";

export const GiftForm = (dataObj) => {
    return api.post("/api/member/WelcomeGift", dataObj);
}

export const getGiftingList = () => {
    return api.get("api/member/GiftsList?pageNumber=1&pageSize=10")
}