import React, { useEffect, useState } from "react";
import { Button, Space, Tag, Modal, Form, message, Divider, Row, Col, Select, Input as AntInput, InputNumber } from "antd";
import { CheckCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../../../services/LocationServices";
import { getAreas } from "../../../services/AreaServices";
import { Edit, Trash2, Search, Filter, ChevronDown, Plus } from "lucide-react";
import DeleteModal from "../../../components/Common/DeleteModal";
import { Card, CardContent } from "../../../components/ui/card";
import { Table as CustomTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";

const { Option } = Select;

const LocationList = () => {
    const [locations, setLocations] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [statusTypeFilter, setStatusTypeFilter] = useState("");
    const [showStatusTypeFilter, setShowStatusTypeFilter] = useState(false);
    const [sortField, setSortField] = useState("");
    const [sortAscending, setSortAscending] = useState(true);
    const [showPageSizeFilter, setShowPageSizeFilter] = useState(false);

    const fetchLocations = async (page = 1, pageSize = 10, params = {}) => {
        try {
            setLoading(true);
            console.log("Fetching with params:", {
                pageNumber: page,
                pageSize,
                search: params.search,
                isAvailable: params.filters?.isAvailable,
                status: params.filters?.status,
            });
            const res = await getLocations({
                pageNumber: page,
                pageSize,
                search: params.search,
                isAvailable: params.filters?.isAvailable,
                areaId: params.filters?.areaId,
                status: params.filters?.status,
            });

            const payload = res ?? {};
            const items = Array.isArray(payload.items)
                ? payload.items
                : Array.isArray(payload.data?.items)
                    ? payload.data.items
                    : Array.isArray(payload.data)
                        ? payload.data
                        : [];
            const total = (payload.totalCount ?? payload.data?.totalCount) || 0;

            setLocations(items);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            console.log("Không thể tải danh sách vị trí!", err);
            message.error("Không thể tải danh sách vị trí!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await getAreas();
                setAreas(data.items || []);
            } catch {
                message.error("Không thể tải danh sách khu vực!");
            }
        };
        fetchAreas();
    }, []);

    // Callback khi filter thay đổi
    const handleFilterChange = (params) => {
        setPagination((p) => ({ ...p, current: 1 }));
        fetchLocations(1, pagination.pageSize, params);
    };

    // Close status filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStatusFilter && !event.target.closest('.status-filter-dropdown')) {
                setShowStatusFilter(false);
            }
            if (showStatusTypeFilter && !event.target.closest('.status-type-filter-dropdown')) {
                setShowStatusTypeFilter(false);
            }
            if (showPageSizeFilter && !event.target.closest('.page-size-filter-dropdown')) {
                setShowPageSizeFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStatusFilter, showStatusTypeFilter, showPageSizeFilter]);

    // Search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLocations(1, pagination.pageSize, {
                search: searchQuery,
                filters: { 
                    isAvailable: statusFilter ? statusFilter === "true" : undefined,
                    status: statusTypeFilter ? Number(statusTypeFilter) : undefined
                }
            });
            setPagination((p) => ({ ...p, current: 1 }));
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, statusFilter, statusTypeFilter]);

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setShowStatusFilter(false);
    };

    const clearStatusFilter = () => {
        setStatusFilter("");
        setShowStatusFilter(false);
    };

    const handleStatusTypeFilter = (status) => {
        setStatusTypeFilter(status);
        setShowStatusTypeFilter(false);
    };

    const clearStatusTypeFilter = () => {
        setStatusTypeFilter("");
        setShowStatusTypeFilter(false);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPagination(prev => ({ ...prev, pageSize: newPageSize, current: 1 }));
        setShowPageSizeFilter(false);
        fetchLocations(1, newPageSize, {
            search: searchQuery,
            filters: { 
                isAvailable: statusFilter ? statusFilter === "true" : undefined,
                status: statusTypeFilter ? Number(statusTypeFilter) : undefined
            }
        });
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAscending(!sortAscending);
        } else {
            setSortField(field);
            setSortAscending(true);
        }
    };

    // Open modal for create
    const handleOpenCreate = () => {
        setIsEdit(false);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Open modal for update
    const handleOpenEdit = (record) => {
        console.log("Editing record:", record);
        setIsEdit(true);
        setEditingLocation(record);
        const selectedArea = areas.find(a => a.areaId === record.areaId);

        form.setFieldsValue({
            areaId: selectedArea?.areaId,
            locationCode: record.locationCode,
            rack: record.rack,
            row: record.row,
            column: record.column,
            isAvailable: record.isAvailable,
            status: record.status,
        });
        setIsModalVisible(true);
    };

    // Submit create or update
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log("Form values:", values);

            const payload = {
                LocationId: editingLocation?.locationId, // lấy từ record edit
                AreaId: Number(values.areaId),
                LocationCode: values.locationCode,
                Rack: values.rack,
                Row: values.row,
                Column: values.column,
                IsAvailable: values.isAvailable,
                Status: isEdit ? Number(values.status) : 1,
            };

            console.log("Sending update request:", payload);

            if (isEdit) {
                await updateLocation(payload);
                window.showToast(
                    `Đã cập nhật vị trí: ${payload.LocationCode || ''}`,
                    "success"
                );
            } else {
                await createLocation(payload);
                window.showToast(
                    `Đã tạo vị trí mới: ${payload.LocationCode || ''}`,
                    "success"
                );
            }

            setIsModalVisible(false);
            fetchLocations(pagination.current, pagination.pageSize, {
                search: searchQuery,
                filters: { 
                    isAvailable: statusFilter ? statusFilter === "true" : undefined,
                    status: statusTypeFilter ? Number(statusTypeFilter) : undefined
                }
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMsg =
                error?.response?.data?.message?.replace(/^\[.*?\]\s*/, "") ||
                error?.message ||
                "Có lỗi xảy ra, vui lòng thử lại!";

            const cleanMsg = errorMsg.replace(/^\[[^\]]*\]\s*/, "")

            window.showToast(cleanMsg, "error");
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    //Delete location
    const handleDeleteConfirm = async () => {
        try {
            await deleteLocation(itemToDelete?.locationId);
            window.showToast(`Đã xóa vị trí: ${itemToDelete?.locationCode || ""}`, "success");
            setShowDeleteModal(false);
            setItemToDelete(null);
            fetchLocations(pagination.current, pagination.pageSize, {
                search: searchQuery,
                filters: { 
                    isAvailable: statusFilter ? statusFilter === "true" : undefined,
                    status: statusTypeFilter ? Number(statusTypeFilter) : undefined
                }
            });
        } catch (error) {
            window.showToast("Có lỗi xảy ra khi xóa vị trí", "error");
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 80,
            align: "center",
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Mã vị trí",
            dataIndex: "locationCode",
            sorter: (a, b) => a.locationCode.localeCompare(b.locationCode),
            render: (code) => <strong>{code}</strong>,
        },
        {
            title: "Khu vực",
            render: (_, record) => record?.areaNameDto?.areaName || "—",
        },
        { title: "Kệ", dataIndex: "rack" },
        { title: "Hàng", dataIndex: "row" },
        { title: "Cột", dataIndex: "column" },
        {
            title: "Tình trạng",
            dataIndex: "isAvailable",
            filters: [
                { text: "Trống", value: true },
                { text: "Đang sử dụng", value: false },
            ],

            onFilter: (value, record) => record.isAvailable === value,
            render: (v) => (
                <Tag color={v ? "green" : "red"}>{v ? "Trống" : "Đang sử dụng"}</Tag>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            filters: [
                { text: "Hoạt động", value: 1 },
                { text: "Không hoạt động", value: 2 },
                { text: "Đã xóa", value: 3 },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const map = { 1: "Hoạt động", 2: "Không hoạt động", 3: "Đã xóa" };
                const color = status === 1 ? "green" : status === 2 ? "orange" : "red";
                return <Tag color={color}>{map[status]}</Tag>;
            },
        },
        {
            title: "Hoạt động",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleOpenEdit(record)}>
                        <Edit className="h-4 w-4 text-[#1a7b7b]" />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            setItemToDelete(record);
                            setShowDeleteModal(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </Space>
            ),
        },
    ];

    // Calculate stats
    const availableCount = Array.isArray(locations) ? locations.filter((l) => l.isAvailable === true).length : 0;
    const unavailableCount = Array.isArray(locations) ? locations.filter((l) => l.isAvailable === false).length : 0;

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)", padding: "24px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Quản lý Vị trí</h1>
                        <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Quản lý các vị trí lưu trữ trong hệ thống</p>
                    </div>
                    <Button
                        style={{
                            backgroundColor: "#237486",
                            borderColor: "#237486",
                            height: "44px",
                            padding: "0 24px",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                        onClick={handleOpenCreate}
                    >
                        <Plus style={{ marginRight: "8px", height: "16px", width: "16px" }} />
                        Thêm vị trí
                    </Button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <Card style={{ borderLeft: "4px solid #237486" }}>
                        <CardContent style={{ paddingTop: "24px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748b" }}>Tổng vị trí</div>
                            <div style={{ fontSize: "30px", fontWeight: "bold", color: "#0f172a", marginTop: "8px" }}>{pagination.total}</div>
                        </CardContent>
                    </Card>
                    <Card style={{ borderLeft: "4px solid #237486" }}>
                        <CardContent style={{ paddingTop: "24px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748b" }}>Trống</div>
                            <div style={{ fontSize: "30px", fontWeight: "bold", color: "#237486", marginTop: "8px" }}>{availableCount}</div>
                        </CardContent>
                    </Card>
                    <Card style={{ borderLeft: "4px solid #237486" }}>
                        <CardContent style={{ paddingTop: "24px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748b" }}>Đang sử dụng</div>
                            <div style={{ fontSize: "30px", fontWeight: "bold", color: "#64748b", marginTop: "8px" }}>{unavailableCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="pt-6">
                        <AntInput
                            placeholder="Tìm kiếm theo tên hoặc mô tả danh mục..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 text-base"
                            prefix={<Search className="h-5 w-5 text-slate-400" />}
                            style={{
                                borderColor: 'rgba(26, 52, 59, 0.2)',
                                backgroundColor: 'rgba(189, 193, 194, 0.2)'
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Locations Table */}
                <Card style={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", overflow: "hidden", padding: 0 }}>
                    <div style={{ width: "100%" }}>
                        {loading ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
                                <div style={{ color: "#64748b" }}>Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <CustomTable style={{ width: "100%" }}>
                                    <TableHeader>
                                        <TableRow style={{ backgroundColor: "#237486", margin: 0, width: "100%" }}>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0, width: "80px" }}>
                                                STT
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0, width: "160px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "4px", margin: "-4px", borderRadius: "4px" }} onClick={() => handleSort("locationCode")}>
                                                    <span>Mã vị trí</span>
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <ChevronDown
                                                            style={{
                                                                height: "12px",
                                                                width: "12px",
                                                                color: sortField === "locationCode" && sortAscending ? "white" : "rgba(255,255,255,0.5)",
                                                                transform: "translateY(1px)"
                                                            }}
                                                        />
                                                        <ChevronDown
                                                            style={{
                                                                height: "12px",
                                                                width: "12px",
                                                                color: sortField === "locationCode" && !sortAscending ? "white" : "rgba(255,255,255,0.5)",
                                                                transform: "translateY(-1px) rotate(180deg)"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0 }}>
                                                Khu vực
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0 }}>
                                                Kệ
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0 }}>
                                                Hàng
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0 }}>
                                                Cột
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0, width: "160px" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                    <span>Tình trạng</span>
                                                    <div style={{ position: "relative" }} className="status-filter-dropdown">
                                                        <button
                                                            onClick={() => setShowStatusFilter(!showStatusFilter)}
                                                            style={{
                                                                padding: "4px",
                                                                borderRadius: "4px",
                                                                border: "none",
                                                                background: statusFilter ? "rgba(255,255,255,0.3)" : "transparent",
                                                                cursor: "pointer",
                                                                color: "white"
                                                            }}
                                                            title="Lọc theo tình trạng"
                                                        >
                                                            <Filter style={{ height: "16px", width: "16px" }} />
                                                        </button>

                                                        {showStatusFilter && (
                                                            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: "4px", width: "192px", backgroundColor: "white", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", zIndex: 10 }}>
                                                                <div style={{ padding: "4px 0" }}>
                                                                    <button
                                                                        onClick={clearStatusFilter}
                                                                        style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: "14px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                                                    >
                                                                        Tất cả
                                                                        {!statusFilter && <span style={{ color: "#237486" }}>✓</span>}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusFilter("true")}
                                                                        style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: "14px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                                                    >
                                                                        Trống
                                                                        {statusFilter === "true" && <span style={{ color: "#237486" }}>✓</span>}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusFilter("false")}
                                                                        style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: "14px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                                                    >
                                                                        Đang sử dụng
                                                                        {statusFilter === "false" && <span style={{ color: "#237486" }}>✓</span>}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0, width: "160px" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                    <span>Trạng thái</span>
                                                    <div style={{ position: "relative" }} className="status-type-filter-dropdown">
                                                        <button
                                                            onClick={() => setShowStatusTypeFilter(!showStatusTypeFilter)}
                                                            style={{
                                                                padding: "4px",
                                                                borderRadius: "4px",
                                                                border: "none",
                                                                background: statusTypeFilter ? "rgba(255,255,255,0.3)" : "transparent",
                                                                cursor: "pointer",
                                                                color: "white"
                                                            }}
                                                            title="Lọc theo trạng thái"
                                                        >
                                                            <Filter style={{ height: "16px", width: "16px" }} />
                                                        </button>

                                                        {showStatusTypeFilter && (
                                                            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: "4px", width: "192px", backgroundColor: "white", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", zIndex: 10 }}>
                                                                <div style={{ padding: "4px 0" }}>
                                                                    <button
                                                                        onClick={clearStatusTypeFilter}
                                                                        style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: "14px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                                                    >
                                                                        Tất cả
                                                                        {!statusTypeFilter && <span style={{ color: "#237486" }}>✓</span>}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusTypeFilter("1")}
                                                                        style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: "14px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                                                    >
                                                                        Hoạt động
                                                                        {statusTypeFilter === "1" && <span style={{ color: "#237486" }}>✓</span>}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusTypeFilter("2")}
                                                                        style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: "14px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                                                    >
                                                                        Ngừng hoạt động
                                                                        {statusTypeFilter === "2" && <span style={{ color: "#237486" }}>✓</span>}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead style={{ fontWeight: "600", color: "white", padding: "12px 16px", border: 0, textAlign: "center" }}>
                                                Hoạt động
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {locations.length > 0 ? (
                                            locations.map((location, index) => (
                                                <TableRow
                                                    key={location.locationId}
                                                    style={{
                                                        backgroundColor: index % 2 === 0 ? "white" : "#f8fafc",
                                                        margin: 0,
                                                        width: "100%"
                                                    }}
                                                >
                                                    <TableCell style={{ color: "#64748b", padding: "12px 16px", border: 0, width: "80px", textAlign: "center", fontWeight: "500" }}>
                                                        {(pagination.current - 1) * pagination.pageSize + index + 1}
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: "500", color: "#0f172a", padding: "12px 16px", border: 0, width: "160px" }}>
                                                        {location?.locationCode || ''}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#374151", padding: "12px 16px", border: 0 }}>
                                                        {location?.areaNameDto?.areaName || "—"}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#374151", padding: "12px 16px", border: 0 }}>
                                                        {location?.rack || ''}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#374151", padding: "12px 16px", border: 0 }}>
                                                        {location?.row || ''}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#374151", padding: "12px 16px", border: 0 }}>
                                                        {location?.column || ''}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#374151", padding: "12px 16px", border: 0, width: "160px", textAlign: "center" }}>
                                                        <span style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "9999px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            backgroundColor: location?.isAvailable ? "#dcfce7" : "#fef2f2",
                                                            color: location?.isAvailable ? "#166534" : "#dc2626"
                                                        }}>
                                                            {location?.isAvailable ? 'Trống' : 'Đang sử dụng'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell style={{ color: "#374151", padding: "12px 16px", border: 0, textAlign: "center" }}>
                                                        <span style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "9999px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            backgroundColor: location?.status === 1 ? "#dcfce7" : location?.status === 2 ? "#fef3c7" : "#fef2f2",
                                                            color: location?.status === 1 ? "#166534" : location?.status === 2 ? "#d97706" : "#dc2626"
                                                        }}>
                                                            {location?.status === 1 ? 'Hoạt động' : location?.status === 2 ? 'Ngừng hoạt động' : 'Đã xóa'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell style={{ color: "#64748b", padding: "12px 16px", border: 0, textAlign: "center" }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                            <button
                                                                style={{ padding: "4px", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}
                                                                title="Chỉnh sửa"
                                                                onClick={() => handleOpenEdit(location)}
                                                            >
                                                                <Edit style={{ height: "16px", width: "16px", color: "#1a7b7b" }} />
                                                            </button>
                                                            <button
                                                                style={{ padding: "4px", background: "none", border: "none", cursor: "pointer", borderRadius: "4px" }}
                                                                title="Xóa"
                                                                onClick={() => {
                                                                    setItemToDelete(location);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                            >
                                                                <Trash2 style={{ height: "16px", width: "16px", color: "#ef4444" }} />
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                                                    Không tìm thấy vị trí nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </CustomTable>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Pagination */}
                {!loading && pagination.total > 0 && (
                    <Card>
                        <CardContent style={{ paddingTop: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ fontSize: "14px", color: "#64748b" }}>
                                    Hiển thị {((pagination.current - 1) * pagination.pageSize) + 1} - {Math.min(pagination.current * pagination.pageSize, pagination.total)} trong tổng số {pagination.total} vị trí
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Button
                                            style={{ border: "none", background: "white" }}
                                            size="small"
                                            onClick={() => {
                                                if (pagination.current > 1) {
                                                    fetchLocations(pagination.current - 1, pagination.pageSize, {
                                                        search: searchQuery,
                                                        filters: { isAvailable: statusFilter ? statusFilter === "true" : undefined }
                                                    });
                                                    setPagination(prev => ({ ...prev, current: prev.current - 1 }));
                                                }
                                            }}
                                            disabled={pagination.current <= 1}
                                        >
                                            Trước
                                        </Button>
                                        <span style={{ fontSize: "14px", color: "#64748b" }}>
                                            Trang {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
                                        </span>
                                        <Button
                                            style={{ border: "none", background: "white" }}
                                            size="small"
                                            onClick={() => {
                                                if (pagination.current < Math.ceil(pagination.total / pagination.pageSize)) {
                                                    fetchLocations(pagination.current + 1, pagination.pageSize, {
                                                        search: searchQuery,
                                                        filters: { isAvailable: statusFilter ? statusFilter === "true" : undefined }
                                                    });
                                                    setPagination(prev => ({ ...prev, current: prev.current + 1 }));
                                                }
                                            }}
                                            disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                                        >
                                            Sau
                                        </Button>
                                    </div>

                                    {/* Page Size Selector */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px", color: "#64748b" }}>Hiển thị:</span>
                                        <div style={{ position: "relative" }} className="page-size-filter-dropdown">
                                            <button
                                                onClick={() => setShowPageSizeFilter(!showPageSizeFilter)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "8px 12px",
                                                    fontSize: "14px",
                                                    border: "1px solid #d1d5db",
                                                    borderRadius: "6px",
                                                    background: "white",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <span>{pagination.pageSize}</span>
                                                <ChevronDown style={{ height: "16px", width: "16px" }} />
                                            </button>

                                            {showPageSizeFilter && (
                                                <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: "4px", width: "80px", backgroundColor: "white", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", zIndex: 10 }}>
                                                    <div style={{ padding: "4px 0" }}>
                                                        {[10, 20, 30, 40].map((size) => (
                                                            <button
                                                                key={size}
                                                                onClick={() => handlePageSizeChange(size)}
                                                                style={{
                                                                    width: "100%",
                                                                    textAlign: "left",
                                                                    padding: "8px 12px",
                                                                    fontSize: "14px",
                                                                    background: pagination.pageSize === size ? "#237486" : "white",
                                                                    color: pagination.pageSize === size ? "white" : "#374151",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between"
                                                                }}
                                                            >
                                                                {size}
                                                                {pagination.pageSize === size && <span style={{ color: "white" }}>✓</span>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span style={{ fontSize: "14px", color: "#64748b" }}>/ Trang</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal Create / Update */}
            <Modal
                title={
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                        {isEdit ? "Cập nhật vị trí lưu trữ" : "Thêm vị trí mới"}
                    </span>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSubmit}
                okText={isEdit ? "Cập nhật" : "Tạo mới"}
                cancelText="Hủy"
                centered
                width={720}
                okButtonProps={{
                    style: {
                        backgroundColor: "#237486",
                        borderColor: "#237486",
                    },
                }}
            >
                <Divider orientation="left">Thông tin cơ bản</Divider>
                <Form
                    form={form}
                    layout="vertical"
                    size="middle"
                    requiredMark={false}
                    style={{ marginTop: 10 }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="areaId"
                                label="Khu vực"
                                rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
                            >
                                <Select
                                    placeholder="Chọn khu vực"
                                    allowClear
                                    showSearch
                                    loading={!areas || areas.length === 0}
                                >
                                    {Array.isArray(areas) ? (
                                        areas.map((area) => (
                                            <Option key={area.areaId} value={area.areaId}>
                                                {area.areaName || `Khu vực ${area.areaId}`}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option disabled>Không thể tải danh sách khu vực</Option>
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="locationCode"
                                label="Mã vị trí"
                                rules={[{ required: true, message: "Vui lòng nhập mã vị trí" }]}
                            >
                                <AntInput
                                    placeholder="VD: A1-01"
                                    maxLength={20}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="rack"
                                label="Kệ"
                                rules={[{ required: true, message: "Vui lòng nhập tên kệ" }]}
                            >
                                <AntInput
                                    placeholder="VD: Kệ A1"
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="row"
                                label="Hàng (Row)"
                                rules={[{ required: true, message: "Vui lòng nhập hàng" }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                    placeholder="VD: 1"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="column"
                                label="Cột (Column)"
                                rules={[{ required: true, message: "Vui lòng nhập cột" }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                    placeholder="VD: 3"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Trạng thái vị trí</Divider>

                    <Row gutter={16}>
                        {isEdit && (
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Trạng thái hoạt động"
                                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                                >
                                    <Select
                                        placeholder="Chọn trạng thái"
                                        suffixIcon={<ThunderboltOutlined />}
                                    >
                                        <Option value={1}>Hoạt động</Option>
                                        <Option value={2}>Không hoạt động</Option>
                                        <Option value={3}>Đã xóa</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={isEdit ? 12 : 24}>
                            <Form.Item
                                name="isAvailable"
                                label="Tình trạng sử dụng"
                                rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
                            >
                                <Select
                                    placeholder="Chọn tình trạng"
                                    suffixIcon={<CheckCircleOutlined />}
                                >
                                    <Option value={true}>Trống</Option>
                                    <Option value={false}>Đang sử dụng</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                itemName={itemToDelete?.locationCode || ""}
            />
        </div>
    );
};

export default LocationList;
