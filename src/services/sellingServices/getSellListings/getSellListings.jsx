import api from "../../../http-common";

export const getSellListing = ({selectedCat, currentPage}) => {
    return api.get(`api/item/ItemApproveList?PageSize=10&PageNumber=${currentPage}&CategoryId=${selectedCat}`);
};


export const approveSellListing = (dataObject) => {
    return api.post(`api/item/ItemRequestApprove`, dataObject);
};

export const getApprovedListing = (selectedCat) => {
    return api.get(`api/item/ItemList?PageSize=10&PageNumber=1&CategoryId=${selectedCat}`);    
};

export const getItemMedia = (itemId, mediaId) => {
    return api.get(`api/item/${itemId}/media/${mediaId}`);
};







