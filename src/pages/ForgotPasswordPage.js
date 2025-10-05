import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Card } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onFinish = async (values) => {
        console.log("Forgot password attempt for:", values.email);
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock success
            setEmailSent(true);
            message.success("Email khôi phục mật khẩu đã được gửi!");
        } catch (error) {
            console.error("Forgot password error:", error);
            message.error("Có lỗi xảy ra khi gửi email!");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div style={{ minHeight: "100vh", display: "flex" }}>
                {/* Phần ảnh bên trái */}
                <div
                    style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        padding: "40px",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Background pattern */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            opacity: 0.3
                        }}
                    />

                    {/* Content */}
                    <div style={{ textAlign: "center", zIndex: 1 }}>
                        <div
                            style={{
                                width: 120,
                                height: 120,
                                background: "rgba(255, 255, 255, 0.2)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 30px",
                                backdropFilter: "blur(10px)"
                            }}
                        >
                            <MailOutlined style={{ fontSize: 60, color: "white" }} />
                        </div>

                        <Title level={1} style={{ color: "white", marginBottom: 16 }}>
                            Email đã được gửi
                        </Title>
                        <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 18 }}>
                            Kiểm tra hộp thư của bạn
                        </Text>
                    </div>
                </div>

                {/* Phần thông báo bên phải */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
                        background: "#fafafa"
                    }}
                >
                    <Card style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
                        <div style={{ marginBottom: 24 }}>
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    background: "#52c41a",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px"
                                }}
                            >
                                <MailOutlined style={{ fontSize: 40, color: "white" }} />
                            </div>
                            <Title level={3} style={{ marginBottom: 16 }}>
                                Kiểm tra email
                            </Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                Chúng tôi đã gửi link khôi phục mật khẩu đến email của bạn.
                                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                            </Text>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                Không thấy email? Kiểm tra thư mục spam hoặc thử lại sau vài phút.
                            </Text>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <Button
                                type="primary"
                                onClick={() => setEmailSent(false)}
                                size="large"
                            >
                                Gửi lại email
                            </Button>
                            <Link to="/login">
                                <Button type="link" icon={<ArrowLeftOutlined />}>
                                    Quay lại đăng nhập
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex" }}>
            {/* Phần ảnh bên trái */}
            <div
                style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    padding: "40px",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Background pattern */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        opacity: 0.3
                    }}
                />

                {/* Content */}
                <div style={{ textAlign: "center", zIndex: 1 }}>
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            background: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 30px",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        <MailOutlined style={{ fontSize: 60, color: "white" }} />
                    </div>

                    <Title level={1} style={{ color: "white", marginBottom: 16 }}>
                        Quên mật khẩu?
                    </Title>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 18 }}>
                        Đừng lo lắng, chúng tôi sẽ giúp bạn
                    </Text>
                    <br />
                    <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 14 }}>
                        Nhập email để nhận link khôi phục mật khẩu
                    </Text>
                </div>
            </div>

            {/* Phần form bên phải */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                    background: "#fafafa"
                }}
            >
                <div style={{ width: "100%", maxWidth: 400 }}>
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                        <Title level={2} style={{ marginBottom: 8 }}>
                            Khôi phục mật khẩu
                        </Title>
                        <Text type="secondary">
                            Nhập email đã đăng ký để nhận hướng dẫn khôi phục
                        </Text>
                    </div>

                    <Form
                        name="forgotPassword"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Nhập email đã đăng ký"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 16 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ width: "100%", height: 45 }}
                            >
                                Gửi link khôi phục
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: "center" }}>
                        <Link to="/login">
                            <Button type="link" icon={<ArrowLeftOutlined />}>
                                Quay lại đăng nhập
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
