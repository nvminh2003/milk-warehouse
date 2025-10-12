import api from "./api";

// Lấy danh sách Area (phân trang, tìm kiếm, sort, filter)
export const getAreas = async (searchParams = {}) => {
    try {
        const body = {
            pageNumber: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 10,
            search: searchParams.search || "",
            sortField: searchParams.sortField || "",
            sortAscending:
                searchParams.sortAscending !== undefined
                    ? searchParams.sortAscending
                    : true,
            // Build filters object: support status and isAvailable
            filters: {},
        };

        if (searchParams.status !== undefined && searchParams.status !== "") {
            body.filters.status = searchParams.status;
        }
        if (searchParams.isAvailable !== undefined && searchParams.isAvailable !== "") {
            body.filters.isAvailable = searchParams.isAvailable;
        }

        const res = await api.post("/Area/Areas", body);
        console.log("Area API response:", res.data);
        console.log("Search params received:", searchParams);

        // API sometimes returns the payload directly in res.data or nested in res.data.data
        // Normalize to an object with { items, totalCount, ... }
        const payload = res?.data?.data ?? res?.data ?? { items: [], totalCount: 0 };
        return payload;
    } catch (error) {
        console.error("Error fetching Areas:", error);
        return { items: [], totalCount: 0 };
    }
};

// Tạo mới Area
export const createArea = async (data) => {
    try {
        const body = {
            AreaId: data.AreaId,
            AreaId: data.AreaId,
            AreaCode: data.AreaCode,
            Rack: data.Rack,
            Row: data.Row,
            Column: data.Column,
            IsAvailable: data.IsAvailable,
            Status: data.Status,
        };

        const res = await api.post("/Area/Create", body);
        console.log("Area Create API response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error creating Area:", error);
        if (error.response && error.response.data && error.response.data.message) {
            // Trả lại message lỗi từ BE
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

// Cập nhật Area
export const updateArea = async (data) => {
    const body = {
        AreaId: data.AreaId,
        AreaId: data.AreaId,
        AreaCode: data.AreaCode,
        Rack: data.Rack,
        Row: data.Row,
        Column: data.Column,
        IsAvailable: data.IsAvailable,
        Status: data.Status,
    };

    try {
        console.log("Sending update request:", body);
        const res = await api.put(`/Area/Update/${data.AreaId}`, body);
        console.log("Area Update API response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error updating Area:", error);
        if (error.response && error.response.data && error.response.data.message) {
            // Trả lại message lỗi từ BE
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

// Xóa Area
export const deleteArea = async (AreaId) => {
    try {
        const res = await api.delete(`/Area/Delete/${AreaId}`);
        console.log("Area Delete API response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error deleting Area:", error);
        throw error;
    }
};
