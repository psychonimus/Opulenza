import api from "../../http-common";

export const registerUser = async (dataObj) => {
    try {
        const { data } = await api.post("api/member/register", dataObj);
        return data;
    } catch (error) {
        throw error;
    }
};
