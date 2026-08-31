import axios from "axios";

export const registerUser = (dataObj) => {
    return axios.post("https://kompasshr.com/OpulenzaReserve/api/member/register", dataObj);


}