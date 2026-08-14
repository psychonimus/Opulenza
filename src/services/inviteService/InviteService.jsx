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

export const approveInvitation = async (invitationId, isApproved) => {
    try {
        const { data } = await api.post("api/invitation/InvitationApprove", {
            InvitationID: invitationId,
            IsApproved : isApproved
        });
        return data;
    } catch (error) {
        throw error;
    }
}

export const getAdminInvitations = () => {
    return api.get(`api/member/MyInvitations?pageNumber=1&pageSize=10`);
};

export const getMemberInvitations = () => {
    return api.get(`api/invitation/InvitationApprovalList?pageSize=10&pageNumber=1`);
};
