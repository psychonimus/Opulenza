import api from "../../http-common";

export const customerLoginApi = async (credentials) => {
  const { data } = await api.post("/api/auth/login", {
    userName: credentials.userName,
    password: credentials.password,
    invitationCode: credentials.invitationCode,
  });
  return data;
};

export const showUserData = () => api.get("/api/member/Me");
