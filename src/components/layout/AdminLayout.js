import React from "react";
import Sidebar from "./SidebarAntd";
import HeaderBar from "./HeaderBar";

const AdminLayout = ({ children }) => {
    const handleLogout = () => {
        // Xử lý đăng xuất ở đây (ví dụ: xóa token, chuyển trang)
        window.location.href = "/auth/login";
    };
    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <HeaderBar onLogout={handleLogout} />
            <Sidebar />
            <main
                style={{
                    padding: 24,
                    paddingLeft: 265, // Để tránh bị sidebar che
                    // marginTop: 64,
                    transition: 'padding-left 0.2s',
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
