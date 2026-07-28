import api from "../../http-common";

export const customerLogin = async (dataObj) => {
    try{
        const { data } = await api.post("/api/auth/login", {
        userName: dataObj.userName,
        password: dataObj.password,
        invitationCode : dataObj.invitationCode
    });
    // console.log("login api hit", data)        
    localStorage.setItem("token", data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.data))
    return data;
    }
    catch (error){
       throw error;
    }
};

