import React from "react";
import { Table, Button, Space, Tag, Input, Select, Card, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const Areas = () => {
    // Dữ liệu cứng cho khu vực fffff
    const areas = [
        {
            id: 1,
            name: "Khu vực A - Sữa tươi",
            code: "KVA",
            description: "Khu vực lưu trữ sữa tươi và sản phẩm lạnh",
            capacity: 1000,
            currentStock: 750,
            status: "active",
            manager: "Nguyễn Văn A",
            location: "Tầng 1 - Kho chính"
        },
        {
            id: 2,
            name: "Khu vực B - Sữa chua",
            code: "KVB",
            description: "Khu vực lưu trữ sữa chua và sản phẩm lên men",
            capacity: 800,
            currentStock: 320,
            status: "active",
            manager: "Trần Thị B",
            location: "Tầng 1 - Kho phụ"
        },
        {
            id: 3,
            name: "Khu vực C - Sữa bột",
            code: "KVC",
            description: "Khu vực lưu trữ sữa bột và sản phẩm khô",
            capacity: 1200,
            currentStock: 980,
            status: "active",
            manager: "Lê Văn C",
            location: "Tầng 2 - Kho chính"
        },
        {
            id: 4,
            name: "Khu vực D - Đóng gói",
            code: "KVD",
            description: "Khu vực đóng gói và xuất hàng",
            capacity: 500,
            currentStock: 150,
            status: "maintenance",
            manager: "Phạm Thị D",
            location: "Tầng 1 - Khu vực đóng gói"
        },
        {
            id: 5,
            name: "Khu vực E - Kho lạnh",
            code: "KVE",
            description: "Khu vực lưu trữ sản phẩm cần bảo quản lạnh",
            capacity: 600,
            currentStock: 0,
            status: "inactive",
            manager: "Hoàng Văn E",
            location: "Tầng hầm - Kho lạnh"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "active": return "green";
            case "maintenance": return "orange";
            case "inactive": return "red";
            default: return "default";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "active": return "Hoạt động";
            case "maintenance": return "Bảo trì";
            case "inactive": return "Ngừng hoạt động";
            default: return status;
        }
    };

    const columns = [
        {
            title: "Mã khu vực",
            dataIndex: "code",
            key: "code",
            render: (code) => <strong>{code}</strong>
        },
        {
            title: "Tên khu vực",
            dataIndex: "name",
            key: "name",
            filteredValue: null,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Vị trí",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            key: "capacity",
            sorter: (a, b) => a.capacity - b.capacity,
            render: (capacity) => `${capacity.toLocaleString()} m²`
        },
        {
            title: "Tồn kho hiện tại",
            dataIndex: "currentStock",
            key: "currentStock",
            sorter: (a, b) => a.currentStock - b.currentStock,
            render: (currentStock, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {currentStock.toLocaleString()} m²
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                        ({Math.round((currentStock / record.capacity) * 100)}%)
                    </div>
                </div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Hoạt động", value: "active" },
                { text: "Bảo trì", value: "maintenance" },
                { text: "Ngừng hoạt động", value: "inactive" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: "Quản lý",
            dataIndex: "manager",
            key: "manager",
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} size="small">
                        Sửa
                    </Button>
                    <Button type="link" danger icon={<DeleteOutlined />} size="small">
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    // Thống kê tổng quan
    const totalCapacity = areas.reduce((sum, area) => sum + area.capacity, 0);
    const totalCurrentStock = areas.reduce((sum, area) => sum + area.currentStock, 0);
    const activeAreas = areas.filter(area => area.status === 'active').length;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>Quản lý khu vực</h2>
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm khu vực
                </Button>
            </div>

            {/* Thống kê tổng quan */}
            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng sức chứa"
                            value={totalCapacity}
                            suffix="m²"
                            prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tồn kho hiện tại"
                            value={totalCurrentStock}
                            suffix="m²"
                            prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Khu vực hoạt động"
                            value={activeAreas}
                            suffix={`/ ${areas.length}`}
                            prefix={<EnvironmentOutlined style={{ color: '#722ed1' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Bộ lọc */}
            <div style={{ marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Search
                    placeholder="Tìm kiếm khu vực..."
                    style={{ width: 300 }}
                    allowClear
                />
                <Select placeholder="Lọc theo trạng thái" style={{ width: 200 }} allowClear>
                    <Option value="active">Hoạt động</Option>
                    <Option value="maintenance">Bảo trì</Option>
                    <Option value="inactive">Ngừng hoạt động</Option>
                </Select>
                <Select placeholder="Lọc theo quản lý" style={{ width: 200 }} allowClear>
                    {[...new Set(areas.map(area => area.manager))].map(manager => (
                        <Option key={manager} value={manager}>{manager}</Option>
                    ))}
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={areas}
                rowKey="id"
                pagination={{
                    total: areas.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khu vực`,
                }}
            />
        </div>
    );
};

export default Areas;

