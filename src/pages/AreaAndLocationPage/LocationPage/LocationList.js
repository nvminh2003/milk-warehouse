import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Modal, Form, message, Divider, Row, Col, Pagination, Select, Input, InputNumber } from "antd";
import { CheckCircleOutlined, PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../../../services/LocationServices";
import { getAreas } from "../../../services/AreaServices";
import { Edit, Trash2 } from "lucide-react";
import DeleteModal from "../../../components/Common/DeleteModal";
import BaseFilter from "../../../components/Common/BaseFilter";

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

    const fetchLocations = async (page = 1, pageSize = 10, params = {}) => {
        try {
            setLoading(true);
            const res = await getLocations({
                pageNumber: page,
                pageSize,
                search: params.search,
                isAvailable: params.filters?.isAvailable,
                areaId: params.filters?.areaId,
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

    // 🧩 Callback khi filter thay đổi
    const handleFilterChange = (params) => {
        setPagination((p) => ({ ...p, current: 1 }));
        fetchLocations(1, pagination.pageSize, params);
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
            fetchLocations(pagination.current, pagination.pageSize);
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

    // 🧩 Delete location
    const handleDeleteConfirm = async () => {
        try {
            await deleteLocation(itemToDelete?.locationId);
            window.showToast(`Đã xóa vị trí: ${itemToDelete?.locationCode || ""}`, "success");
            setShowDeleteModal(false);
            setItemToDelete(null);
            fetchLocations(pagination.current, pagination.pageSize);
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
            title: "Thao tác",
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

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <h2 style={{ fontWeight: 700, fontSize: 24 }}>Quản lý vị trí</h2>
                <Button type="primary" style={{ backgroundColor: "#237486", borderColor: "#237486" }} icon={<PlusOutlined />} onClick={handleOpenCreate}>
                    Thêm vị trí
                </Button>
            </div>

            <BaseFilter
                onFilterChange={handleFilterChange}
                applyMode="auto"
                filtersConfig={[
                    // {
                    //     label: "Tình trạng sử dụng",
                    //     name: "isAvailable",
                    //     type: "select",
                    //     options: [
                    //         { label: "Trống", value: "true" },
                    //         { label: "Đang sử dụng", value: "false" },
                    //     ],
                    // },
                    // {
                    //     label: "Khu vực",
                    //     name: "areaId",
                    //     type: "select",
                    //     options: areas.map((a) => ({
                    //         label: a.areaName,
                    //         value: a.areaId,
                    //     })),
                    // },

                ]}
                placeholderSearch="Tìm kiếm mã vị trí"
            />

            {/* Table without built-in pagination */}
            <Table
                columns={columns}
                dataSource={locations}
                loading={loading}
                pagination={false}
                rowKey="locationId"
            />

            {/* Custom pagination footer */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "15px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ fontSize: 14, color: "#475569" }}>
                    {pagination.total === 0
                        ? "Hiển thị 0 - 0 trong tổng số 0 vị trí"
                        : `Hiển thị ${(pagination.current - 1) * pagination.pageSize + 1
                        } - ${Math.min(
                            pagination.current * pagination.pageSize,
                            pagination.total
                        )} trong tổng số ${pagination.total} vị trí`}
                </div>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    size="small"
                    onChange={(page, size) => {
                        setPagination((p) => ({ ...p, current: page, pageSize: size }));
                        fetchLocations(page, size);
                    }}
                />
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
                                <Input
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
                                <Input
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
