import api from "../../http-common";

export const customerLogin = async (dataObj) => {
    const { data } = await api.post("/api/auth/login", {
        userName: dataObj.userName,
        password: dataObj.password,
    });
    console.log("login api hit", dataObj)
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data))
    return data;
};