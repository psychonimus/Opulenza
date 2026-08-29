import { Axios } from "axios";
import api from "../../http-common";

// export const userData = async () => {
//     try {
//         // const { data } = await api.get("/api/invitation/listForApproval");
//         // console.log("login api hit", data)
//         // // localStorage.setItem("token", data.data.accessToken);
//         // // localStorage.setItem("user", JSON.stringify(data.data))
//         // return data;
//         return AxiosInstance.get("/api/invitation/listForApproval");
//     }
//     catch (error){
//        throw error;
//     }
// };
export const checkUserEmail = (email) => {
  return api.get(`/api/auth/IsPasswordExists?Email=${email}`);
};

export const userData = () => {
  return api.get("/api/member/listForApproval?pageNumber=1&pageSize=10");
};

export const GetAddress = () => {
  return api.get("/api/member/MyAddress");
};

export const AddAddress = (dataObj) => {
  return api.post("/api/member/AddAddress", dataObj);
};

export const DeleteAddress = (id) => {
  return api.post("api/member/DeleteAddress", id);
};

// api/member/AddDocument
export const AddDocument = (dataObj) => {
  return api.post("/api/member/AddDocument", dataObj);
};

export const AddPreferences = (dataObj) => {
  return api.post("/api/member/AddPreferences", dataObj);
};

export const GetPreferences = () => {
  return api.get("/api/member/GetPreferences");
};

export const GetMyInvitations = () => {
  return api.get("/api/member/MyInvitations?pageNumber=1&pageSize=10");
};

export const GetMySoldItems = () => {
  return api.get("/api/member/MyItems?PageNumber=1&PageSize=10&CategoryId=0");
};









