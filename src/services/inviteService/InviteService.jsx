import api from "../../http-common";

export const inviteUser = async (inviteObj) => {
    // console.log("InviteObj : ", inviteObj)
    try {
        const { data } = await api.post("api/invitation/invite", inviteObj);

       localStorage.setItem('inviteCode', data.data.inviteCode);
        return data;
    } catch (error) {
        throw error;
    }
}