import axios from "axios";

export const ContactForm = (dataObj) => {
    return axios.post("https://kompasshr.com/OpulenzaReserve/api/Contact", dataObj);
}