import axios from "axios";

export const ConvertToUsd = (currency) => {
  return axios.get(`https://api.frankfurter.dev/v2/rate/${currency}/USD`);
};

export const ConvertCurrency = (currency) => {
  return axios.get(`https://api.frankfurter.dev/v2/rate/USD/${currency}`);
};