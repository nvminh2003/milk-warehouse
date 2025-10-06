import React from "react";
import { Table, Button, Space, Tag, Input, Select, Card, Row, Col, Statistic, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EnvironmentOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const Locations = () => {
    // Dữ liệu cứng cho vị trí
    const locations = [
        {
            id: 1,
            name: "Kho chính - Tầng 1",
            code: "KC-T1",
            area: "Khu vực A - Sữa tươi",
            rack: "Kệ A1",
            shelf: "Tầng 1",
            position: "A1-01",
            capacity: 50,
            currentStock: 35,
            status: "occupied",
            productType: "Sữa tươi",
            lastUpdated: "2024-01-15 10:30"
        },
        {
            id: 2,
            name: "Kho chính - Tầng 1",
            code: "KC-T1",
            area: "Khu vực A - Sữa tươi",
            rack: "Kệ A1",
            shelf: "Tầng 2",
            position: "A1-02",
            capacity: 50,
            currentStock: 0,
            status: "available",
            productType: "Sữa tươi",
            lastUpdated: "2024-01-15 09:15"
        },
        {
            id: 3,
            name: "Kho phụ - Tầng 1",
            code: "KP-T1",
            area: "Khu vực B - Sữa chua",
            rack: "Kệ B1",
            shelf: "Tầng 1",
            position: "B1-01",
            capacity: 40,
            currentStock: 40,
            status: "full",
            productType: "Sữa chua",
            lastUpdated: "2024-01-15 11:45"
        },
        {
            id: 4,
            name: "Kho chính - Tầng 2",
            code: "KC-T2",
            area: "Khu vực C - Sữa bột",
            rack: "Kệ C1",
            shelf: "Tầng 1",
            position: "C1-01",
            capacity: 80,
            currentStock: 65,
            status: "occupied",
            productType: "Sữa bột",
            lastUpdated: "2024-01-15 14:20"
        },
        {
            id: 5,
            name: "Kho lạnh - Tầng hầm",
            code: "KL-TH",
            area: "Khu vực E - Kho lạnh",
            rack: "Kệ E1",
            shelf: "Tầng 1",
            position: "E1-01",
            capacity: 30,
            currentStock: 0,
            status: "maintenance",
            productType: "Sản phẩm lạnh",
            lastUpdated: "2024-01-14 16:00"
        },
        {
            id: 6,
            name: "Khu đóng gói",
            code: "KDG",
            area: "Khu vực D - Đóng gói",
            rack: "Kệ D1",
            shelf: "Tầng 1",
            position: "D1-01",
            capacity: 20,
            currentStock: 15,
            status: "occupied",
            productType: "Đóng gói",
            lastUpdated: "2024-01-15 08:30"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "available": return "green";
            case "occupied": return "blue";
            case "full": return "orange";
            case "maintenance": return "red";
            default: return "default";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "available": return "Trống";
            case "occupied": return "Đang sử dụng";
            case "full": return "Đầy";
            case "maintenance": return "Bảo trì";
            default: return status;
        }
    };

    const columns = [
        {
            title: "Vị trí",
            dataIndex: "position",
            key: "position",
            render: (position) => <strong>{position}</strong>
        },
        {
            title: "Khu vực",
            dataIndex: "area",
            key: "area",
            filters: [
                { text: "Khu vực A - Sữa tươi", value: "Khu vực A - Sữa tươi" },
                { text: "Khu vực B - Sữa chua", value: "Khu vực B - Sữa chua" },
                { text: "Khu vực C - Sữa bột", value: "Khu vực C - Sữa bột" },
                { text: "Khu vực D - Đóng gói", value: "Khu vực D - Đóng gói" },
                { text: "Khu vực E - Kho lạnh", value: "Khu vực E - Kho lạnh" },
            ],
            onFilter: (value, record) => record.area === value,
        },
        {
            title: "Kệ/Tầng",
            key: "rackShelf",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.rack}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{record.shelf}</div>
                </div>
            )
        },
        {
            title: "Loại sản phẩm",
            dataIndex: "productType",
            key: "productType",
            filters: [
                { text: "Sữa tươi", value: "Sữa tươi" },
                { text: "Sữa chua", value: "Sữa chua" },
                { text: "Sữa bột", value: "Sữa bột" },
                { text: "Sản phẩm lạnh", value: "Sản phẩm lạnh" },
                { text: "Đóng gói", value: "Đóng gói" },
            ],
            onFilter: (value, record) => record.productType === value,
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            key: "capacity",
            sorter: (a, b) => a.capacity - b.capacity,
            render: (capacity) => `${capacity} m³`
        },
        {
            title: "Tồn kho",
            dataIndex: "currentStock",
            key: "currentStock",
            sorter: (a, b) => a.currentStock - b.currentStock,
            render: (currentStock, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {currentStock} m³
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
                { text: "Trống", value: "available" },
                { text: "Đang sử dụng", value: "occupied" },
                { text: "Đầy", value: "full" },
                { text: "Bảo trì", value: "maintenance" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: "Cập nhật cuối",
            dataIndex: "lastUpdated",
            key: "lastUpdated",
            sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
            render: (lastUpdated) => (
                <Tooltip title={lastUpdated}>
                    <span>{lastUpdated.split(' ')[0]}</span>
                </Tooltip>
            )
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
    const totalCapacity = locations.reduce((sum, location) => sum + location.capacity, 0);
    const totalCurrentStock = locations.reduce((sum, location) => sum + location.currentStock, 0);
    const availableLocations = locations.filter(location => location.status === 'available').length;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>Quản lý vị trí</h2>
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm vị trí
                </Button>
            </div>

            {/* Thống kê tổng quan */}
            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng sức chứa"
                            value={totalCapacity}
                            suffix="m³"
                            prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tồn kho hiện tại"
                            value={totalCurrentStock}
                            suffix="m³"
                            prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Vị trí trống"
                            value={availableLocations}
                            suffix={`/ ${locations.length}`}
                            prefix={<EnvironmentOutlined style={{ color: '#722ed1' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Bộ lọc */}
            <div style={{ marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Search
                    placeholder="Tìm kiếm vị trí..."
                    style={{ width: 300 }}
                    allowClear
                />
                <Select placeholder="Lọc theo trạng thái" style={{ width: 200 }} allowClear>
                    <Option value="available">Trống</Option>
                    <Option value="occupied">Đang sử dụng</Option>
                    <Option value="full">Đầy</Option>
                    <Option value="maintenance">Bảo trì</Option>
                </Select>
                <Select placeholder="Lọc theo loại sản phẩm" style={{ width: 200 }} allowClear>
                    <Option value="Sữa tươi">Sữa tươi</Option>
                    <Option value="Sữa chua">Sữa chua</Option>
                    <Option value="Sữa bột">Sữa bột</Option>
                    <Option value="Sản phẩm lạnh">Sản phẩm lạnh</Option>
                    <Option value="Đóng gói">Đóng gói</Option>
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={locations}
                rowKey="id"
                pagination={{
                    total: locations.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} vị trí`,
                }}
            />
        </div>
    );
};

export default Locations;
