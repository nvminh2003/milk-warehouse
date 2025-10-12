import api from "./api";

export const getRetailers = async (searchParams = {}) => {
    try {
        const body = {
            pageNumber: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 10,
            search: searchParams.search || "",
            sortField: searchParams.sortField || "",
            sortAscending: searchParams.sortAscending !== undefined ? searchParams.sortAscending : true,
            filters: searchParams.status ? { status: searchParams.status } : {}
        };
        const res = await api.post("/Retailer/Retailers", body);
        console.log("Retailer API response:", res.data);
        console.log("Search params received:", searchParams);

        return res.data;
    } catch (error) {
        console.error("Error fetching retailers:", error);
        return { data: [], totalCount: 0 };
    }
};

export const getRetailerDetail = async (retailerId) => {
    try {
        const res = await api.get(`/Retailer/GetRetailerByRetailerId/${retailerId}`);
        console.log("Get retailer detail response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching retailer detail:", error);
        throw error;
    }
};