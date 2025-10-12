import React, { useEffect, useState, useMemo } from "react";
import { Menu, Avatar } from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    BarChartOutlined,
    SettingOutlined,
    EnvironmentOutlined,
    UsergroupAddOutlined,
    ClusterOutlined,
    AppstoreOutlined,
    ContainerOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ComponentIcon } from "../../components/IconComponent/Icon";

const Sidebar = ({ collapsed, isMobile }) => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("userInfo");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const role = user?.roles?.[0] || "Guest";

    const arrowWhiteStyle = `
        .ant-menu-submenu-arrow {
            color: white !important;
        }
    `;

    /** --- TOÀN BỘ MENU GỐC --- */
    const allMenuItems = [
        {
            key: "/admin/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
            roles: ["Warehouse Manager", "Employee"],
        },
        {
            key: "/admin/accounts",
            icon: <UsergroupAddOutlined />,
            label: "Quản lý tài khoản",
            roles: ["Warehouse Manager"], // chỉ manager mới thấy
        },
        {
            key: "/sales-manager/categorys",
            icon: <ComponentIcon name="category" size={15} collapsed={collapsed} />,
            label: "Quản lý danh mục",
            roles: ["Warehouse Manager"],
        },
        {
            key: "/sales-manager/unitMeasures",
            icon: <ComponentIcon name="unitMeasure" size={15} collapsed={collapsed} />,
            label: "Quản lý đơn vị",
        },
        {
            key: "/sales-manager/goods",
            icon: <ComponentIcon name="milk" size={15} collapsed={collapsed} />,
            label: "Quản lý hàng hóa",
        },
        {
            key: "partner-management",
            icon: <ComponentIcon name="partner" size={15} collapsed={collapsed} />,
            label: "Quản lý đối tác",
            children: [
                {
                    key: "/sales-manager/suppliers",
                    icon: <ComponentIcon name="supplier" size={15} collapsed={collapsed} />,
                    label: "Quản lý nhà cung cấp",
                },
                {
                    key: "/sales-manager/retailers",
                    icon: <ComponentIcon name="retailer" size={15} collapsed={collapsed} />,
                    label: "Quản lý nhà bán lẻ",
                },
            ],
            label: "Quản lý sản phẩm",
            roles: ["Warehouse Manager", "Employee"],
        },
        {
            key: "location-management",
            icon: <EnvironmentOutlined />,
            label: "Quản lý vị trí và khu vực",
            roles: ["Warehouse Manager"],
            children: [
                {
                    key: "/admin/areas",
                    icon: <AppstoreOutlined />,
                    label: "Quản lý khu vực",
                },
                {
                    key: "/admin/locations",
                    icon: <ClusterOutlined />,
                    label: "Quản lý vị trí",
                },
                {
                    key: "/admin/storage-condition",
                    icon: <ComponentIcon name="storageCondition" size={15} collapsed={collapsed} />,
                    label: "Quản lý điều kiện bảo quản",
                },
            ],
        },
        {
            key: "/admin/batch",
            icon: <ContainerOutlined />,
            label: "Quản lý lô hàng",
            roles: ["Warehouse Manager", "Employee"],
        },
        {
            key: "/admin/products",
            icon: <ShoppingOutlined />,
            label: "Sản phẩm",
            roles: ["Warehouse Manager", "Employee"],
        },
        {
            key: "/admin/orders",
            icon: <ShoppingCartOutlined />,
            label: "Đơn hàng",
            roles: ["Warehouse Manager", "Employee"],
        },
        {
            key: "/admin/reports",
            icon: <BarChartOutlined />,
            label: "Báo cáo",
            roles: ["Warehouse Manager"],
        },
        {
            key: "/admin/settings",
            icon: <SettingOutlined />,
            label: "Cài đặt",
            roles: ["Warehouse Manager"],
        },
    ];

    /** --- LỌC MENU THEO ROLE --- */
    const menuItems = useMemo(() => {
        return allMenuItems
            .filter((item) => item.roles?.includes(role))
            .map((item) => {
                if (item.children) {
                    return {
                        ...item,
                        children: item.children.map((sub) => ({
                            ...sub,
                            label: collapsed ? null : (
                                <Link
                                    to={sub.key}
                                    style={{
                                        color:
                                            location.pathname === sub.key
                                                ? "black"
                                                : "white",
                                    }}
                                >
                                    {sub.label}
                                </Link>
                            ),
                        })),
                    };
                }
                return item;
            });
    }, [role, collapsed, location.pathname]);

    const renderIcon = (icon, active) => {
        if (icon?.type?.name === "ComponentIcon") {
            return React.cloneElement(icon, { color: active ? "black" : "white" });
        }
        return React.cloneElement(icon, {
            style: { color: active ? "black" : "white" },
        });
    };

    const getInitial = (name) => {
        if (!name) return "?";
        const words = name.trim().split(" ");
        return words[words.length - 1][0].toUpperCase();
    };

    return (
        <>
            <style>{arrowWhiteStyle}</style>
            <aside
                className={collapsed ? "" : "sidebar-container"}
                style={{
                    position: "fixed",
                    left: 0,
                    top: 64,
                    bottom: 0,
                    width: collapsed ? 80 : 280,
                    background: "#237486",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,
                    transition: "width 0.3s ease-in-out, transform 0.3s ease-in-out",
                    overflow: "hidden",
                    transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
                    boxShadow: isMobile ? "2px 0 8px rgba(0,0,0,0.15)" : "none",
                }}
            >
                {/* Header user */}
                <div
                    style={{
                        padding: collapsed ? "20px 12px" : "20px 16px",
                        borderBottom: "1px solid #e9ecef",
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
                            fontWeight: "bold",
                        }}
                    >
                        {getInitial(user?.fullName || "U")}
                    </Avatar>
                    {!collapsed && (
                        <div style={{ marginLeft: 12, color: "white" }}>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>
                                {user?.fullName || "Người dùng"}
                            </div>
                            <div style={{ fontSize: 12 }}>
                                Chức vụ: {role}
                            </div>
                        </div>
                    )}
                </div>

                {/* Menu */}
                <div className="sidebar-scroll" style={{ flex: 1, background: "#237486" }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems.map((item) => {
                            const isActive =
                                location.pathname === item.key ||
                                item.children?.some((c) => c.key === location.pathname);

                            if (item.children) {
                                return {
                                    ...item,
                                    icon: renderIcon(item.icon, isActive),
                                    label: collapsed ? null : (
                                        <span style={{ color: "white" }}>{item.label}</span>
                                    ),
                                    children: item.children,
                                };
                            }

                            return {
                                ...item,
                                icon: renderIcon(item.icon, isActive),
                                label: collapsed ? null : (
                                    <Link
                                        to={item.key}
                                        style={{
                                            color: isActive ? "black" : "white",
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ),
                            };
                        })}
                        style={{
                            borderRight: 0,
                            backgroundColor: "#237486",
                        }}
                        defaultOpenKeys={collapsed ? [] : ["location-management"]}
                        inlineCollapsed={collapsed}
                    />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
