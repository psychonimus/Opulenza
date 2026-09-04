import api from "../../../http-common";

export const getSellListing = ({selectedCat, currentPage}) => {
    return api.get(`api/item/ItemApproveList?PageSize=10&PageNumber=${currentPage}&CategoryId=${selectedCat}`);
};


export const approveSellListing = (dataObject) => {
    return api.post(`api/item/ItemRequestApprove`, dataObject);
};


export const updateListingItemImage = (dataObject) => {
    return api.post(`api/item/EditImages`, dataObject);
};

export const updateWishListItem = (dataObject) => {
    return api.post(`api/item/UpdateWishlist`, dataObject);
};








export const getApprovedListing = (selectedCat, pageNumber = 1) => {
    return api.get(`api/item/ItemList?PageSize=10&PageNumber=${pageNumber}&CategoryId=${selectedCat}`);    
};

export const getItemMedia = (itemId, mediaId) => {
    return api.get(`api/item/${itemId}/media/${mediaId}`);
};


export const getMyWishList = () => {
    return api.get(`api/item/GetWishlist?PageSize=10&PageNumber=1`);
};


export const getMyActiveBids = () => {
    return api.get(`api/member/MyActiveBids?pageNumber=1&pageSize=10&categoryId=0`);
};







