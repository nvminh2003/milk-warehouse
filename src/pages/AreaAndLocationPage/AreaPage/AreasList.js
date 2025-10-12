import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Modal, Form, message, Divider, Row, Col, Pagination, Select, Input } from "antd";
import { CheckCircleOutlined, PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { getAreas, createArea, updateArea, deleteArea } from "../../../services/AreaServices";
import { Edit, Trash2 } from "lucide-react";
import DeleteModal from "../../../components/Common/DeleteModal";
import BaseFilter from "../../../components/Common/BaseFilter";

const { Option } = Select;

const AreaLists = () => {
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
    const [editingArea, setEditingArea] = useState(null);

    // 🧩 Fetch list areas
    const fetchAreas = async (page = 1, pageSize = 10, params = {}) => {
        try {
            setLoading(true);
            const res = await getAreas({
                pageNumber: page,
                pageSize,
                search: params.search,
                filters: params.filters,
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

            setAreas(items);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            console.log("Không thể tải danh sách khu vực!", err);
            message.error("Không thể tải danh sách khu vực!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas(pagination.current, pagination.pageSize);
    }, []);

    // 🧩 Khi thay đổi filter
    const handleFilterChange = (params) => {
        setPagination((p) => ({ ...p, current: 1 }));
        fetchAreas(1, pagination.pageSize, params);
    };

    // 🧩 Mở modal thêm mới
    const handleOpenCreate = () => {
        setIsEdit(false);
        form.resetFields();
        setIsModalVisible(true);
    };

    // 🧩 Mở modal sửa
    const handleOpenEdit = (record) => {
        setIsEdit(true);
        setEditingArea(record);
        form.setFieldsValue({
            areaName: record.areaName,
            areaCode: record.areaCode,
            description: record.description,
            storageConditionId: record.storageConditionId,
            status: record.status,
        });
        setIsModalVisible(true);
    };

    // 🧩 Submit form
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                areaName: values.areaName,
                areaCode: values.areaCode,
                description: values.description,
                storageConditionId: Number(values.storageConditionId),
                status: isEdit ? Number(values.status) : 1,
            };

            if (isEdit) {
                await updateArea(editingArea.areaId, payload);
                window.showToast(`Đã cập nhật khu vực: ${payload.areaCode}`, "success");
            } else {
                await createArea(payload);
                window.showToast(`Đã tạo khu vực mới: ${payload.areaCode}`, "success");
            }

            setIsModalVisible(false);
            fetchAreas(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error("Error submitting form:", error);
            const cleanMsg =
                error?.response?.data?.message?.replace(/^\[.*?\]\s*/, "") ||
                error?.message ||
                "Có lỗi xảy ra, vui lòng thử lại!";
            window.showToast(cleanMsg, "error");
        }
    };

    // 🧩 Xóa khu vực
    const handleDeleteConfirm = async () => {
        try {
            await deleteArea(itemToDelete?.areaId);
            window.showToast(`Đã xóa khu vực: ${itemToDelete?.areaCode || ""}`, "success");
            setShowDeleteModal(false);
            fetchAreas(pagination.current, pagination.pageSize);
        } catch (error) {
            window.showToast("Có lỗi xảy ra khi xóa khu vực", "error");
        }
    };

    // 🧩 Cột bảng
    const columns = [
        {
            title: "STT",
            key: "index",
            width: 70,
            align: "center",
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Mã khu vực",
            dataIndex: "areaCode",
            render: (code) => <strong>{code}</strong>,
        },
        {
            title: "Tên khu vực",
            dataIndex: "areaName",
            render: (name) => name || "—",
        },
        {
            title: "Điều kiện lưu trữ",
            dataIndex: "storageConditionId",
            render: (v) => v ?? "—",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            render: (desc) => (desc?.length > 50 ? desc.slice(0, 50) + "..." : desc || "—"),
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
                <h2 style={{ fontWeight: 700, fontSize: 24 }}>Quản lý khu vực</h2>
                <Button
                    type="primary"
                    style={{ backgroundColor: "#237486", borderColor: "#237486" }}
                    icon={<PlusOutlined />}
                    onClick={handleOpenCreate}
                >
                    Thêm khu vực
                </Button>
            </div>

            <BaseFilter
                onFilterChange={handleFilterChange}
                applyMode="auto"
                filtersConfig={[
                    // {
                    //     label: "Trạng thái",
                    //     name: "status",
                    //     type: "select",
                    //     options: [
                    //         { label: "Hoạt động", value: 1 },
                    //         { label: "Không hoạt động", value: 2 },
                    //         { label: "Đã xóa", value: 3 },
                    //     ],
                    // },
                ]}
                placeholderSearch="Tìm kiếm mã khu vực"
            />

            <Table
                columns={columns}
                dataSource={areas}
                loading={loading}
                pagination={false}
                rowKey="areaId"
            />

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
                        ? "Hiển thị 0 - 0 trong tổng số 0 khu vực"
                        : `Hiển thị ${(pagination.current - 1) * pagination.pageSize + 1
                        } - ${Math.min(
                            pagination.current * pagination.pageSize,
                            pagination.total
                        )} trong tổng số ${pagination.total} khu vực`}
                </div>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    size="small"
                    onChange={(page, size) => {
                        setPagination((p) => ({ ...p, current: page, pageSize: size }));
                        fetchAreas(page, size);
                    }}
                />
            </div>

            {/* Modal */}
            <Modal
                title={
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                        {isEdit ? "Cập nhật khu vực" : "Thêm khu vực mới"}
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
                    style: { backgroundColor: "#237486", borderColor: "#237486" },
                }}
            >
                <Divider orientation="left">Thông tin khu vực</Divider>
                <Form form={form} layout="vertical" requiredMark={false}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="areaName"
                                label="Tên khu vực"
                                rules={[{ required: true, message: "Vui lòng nhập tên khu vực" }]}
                            >
                                <Input placeholder="VD: Khu A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="areaCode"
                                label="Mã khu vực"
                                rules={[{ required: true, message: "Vui lòng nhập mã khu vực" }]}
                            >
                                <Input placeholder="VD: A1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="storageConditionId"
                                label="Điều kiện lưu trữ"
                                rules={[{ required: true, message: "Vui lòng nhập ID điều kiện lưu trữ" }]}
                            >
                                <Input placeholder="VD: 1" type="number" />
                            </Form.Item>
                        </Col>
                        {isEdit && (
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                                >
                                    <Select placeholder="Chọn trạng thái" suffixIcon={<ThunderboltOutlined />}>
                                        <Option value={1}>Hoạt động</Option>
                                        <Option value={2}>Không hoạt động</Option>
                                        <Option value={3}>Đã xóa</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Form.Item name="description" label="Mô tả">
                                <Input.TextArea rows={3} placeholder="Nhập mô tả khu vực (nếu có)" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                itemName={itemToDelete?.areaCode || ""}
            />
        </div>
    );
};

export default AreaLists;
