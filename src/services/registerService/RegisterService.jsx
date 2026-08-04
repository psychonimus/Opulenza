import axios from "axios";

export const registerUser = (dataObj) => {
    return axios.post("https://ayurmitra.in/opulenza_reserve/api/member/register", dataObj);

    
}