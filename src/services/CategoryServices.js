import api from "./api";

export const getCategory = async () => {
    try {
        const body = {
            categorySearch: "",
            status: 1
        };
        const res = await api.post("/Category/Categories", body);
        console.log("Category API response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
