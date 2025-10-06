import React from "react";
import { Menu, Avatar } from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    BarChartOutlined,
    SettingOutlined,
    EnvironmentOutlined,
    UserOutlined,
    StarOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed, isMobile }) => {
    const location = useLocation();
    // const navigate = useNavigate();

    const menuItems = [
        {
            key: "location-management",
            icon: <EnvironmentOutlined />,
            label: "Quản lý vị trí và khu vực",
            children: [
                {
                    key: "/admin/areas",
                    label: <Link to="/admin/areas">Quản lý khu vực</Link>,
                },
                {
                    key: "/admin/locations",
                    label: <Link to="/admin/locations">Quản lý vị trí</Link>,
                },
            ],
        },
        {
            key: "/admin/dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
        },
        {
            key: "/admin/products",
            icon: <ShoppingOutlined />,
            label: <Link to="/admin/products">Sản phẩm</Link>,
        },
        {
            key: "/admin/orders",
            icon: <ShoppingCartOutlined />,
            label: <Link to="/admin/orders">Đơn hàng</Link>,
        },
        {
            key: "/admin/reports",
            icon: <BarChartOutlined />,
            label: <Link to="/admin/reports">Báo cáo</Link>,
        },
        {
            key: "/admin/settings",
            icon: <SettingOutlined />,
            label: <Link to="/admin/settings">Cài đặt</Link>,
        },
    ];

    return (
        <aside
            style={{
                position: "fixed",
                left: 0,
                top: 64, // Bắt đầu dưới header
                bottom: 0,
                width: collapsed ? 80 : 280,
                background: "#f8f9fa",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
                transition: "width 0.3s ease-in-out, transform 0.3s ease-in-out",
                overflow: "hidden",
                transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
                boxShadow: isMobile ? "2px 0 8px rgba(0,0,0,0.15)" : "none",
            }}
        >

            {/* Thông tin user */}
            <div
                style={{
                    padding: collapsed ? "20px 12px" : "20px 16px",
                    background: "white",
                    borderBottom: "1px solid #e9ecef",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: collapsed ? "center" : "flex-start",
                    alignItems: "center",
                }}
            >
                <Avatar
                    size={collapsed ? 40 : 50}
                    style={{
                        background: "#ffc107",
                        color: "white",
                        fontWeight: "bold"
                    }}
                >
                    PKL
                </Avatar>
                {!collapsed && (
                    <div style={{ marginLeft: 12 }}>
                        <div style={{ fontWeight: 600, fontSize: 16, color: "#212529" }}>
                            Phan Kim Liên
                        </div>
                        <div style={{ fontSize: 12, color: "#6c757d" }}>
                            Chức vụ: Administrator
                        </div>
                    </div>
                )}
            </div>

            {/* Menu chiếm phần còn lại */}
            <div style={{ flex: 1, overflowY: "auto", background: "white" }}>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                    defaultOpenKeys={collapsed ? [] : ["location-management"]}
                    inlineCollapsed={collapsed}
                />
            </div>
        </aside>


    );
};

export default Sidebar;
