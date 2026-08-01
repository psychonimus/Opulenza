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

export const userData = () => {
  return api.get("/api/invitation/listForApproval");
};

