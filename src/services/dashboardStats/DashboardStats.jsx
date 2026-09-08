import api from "../../http-common";

export const GetDashboardStats = () => {
  return api.get("/api/member/Dashboard");
};