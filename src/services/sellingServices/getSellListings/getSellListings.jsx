import api from "../../../http-common";

export const getSellListing = ({selectedCat, currentPage}) => {
    return api.get(`api/item/ItemApproveList?PageSize=10&PageNumber=${currentPage}&CategoryId=${selectedCat}`);
};


export const approveSellListing = ({dataObject}) => {
    return api.post(`api/item/ItemRequestApprove`, {dataObject});
};


