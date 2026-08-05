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

export const getInvitationApprovalList = async () => {
    try {
        const { data } = await api.get("api/invitation/InvitationApprovalList");
        return data;
    } catch (error) {
        throw error;
    }
}

export const approveInvitation = async (invitationId) => {
    try {
        const { data } = await api.post("api/invitation/InvitationApprove", {
            InvitationID: invitationId
        });
        return data;
    } catch (error) {
        throw error;
    }
}