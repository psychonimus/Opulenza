import api from "../../http-common";


export const VerifyUser = (payload) => {
  return api.post(`/api/member/ApproveMember`,payload);
}