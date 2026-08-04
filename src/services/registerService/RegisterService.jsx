import axios from "axios";

export const registerUser = (dataObj) => {
    return axios.post("http://115.124.123.180:8091/api/member/register", dataObj);

    
}