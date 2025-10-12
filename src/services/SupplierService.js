import api from "./api";

export const getSuppliers = async (searchParams = {}) => {
    try {
        const body = {
            pageNumber: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 10,
            search: searchParams.search || "",
            sortField: searchParams.sortField || "",
            sortAscending: searchParams.sortAscending !== undefined ? searchParams.sortAscending : true,
            filters: searchParams.status ? { status: searchParams.status } : {}
        };


        const res = await api.post("/Supplier/Suppliers", body);
        console.log("Supplier API response:", res.data);
        console.log("Search params received:", searchParams);

        return res.data;
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return { data: [], totalCount: 0 };
    }
};




