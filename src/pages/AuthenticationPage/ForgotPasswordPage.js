import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onFinish = async (values) => {
        console.log("Forgot password for:", values.email);
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setEmailSent(true);
            message.success("Đã gửi email khôi phục mật khẩu!");
        } catch (err) {
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fa",
                padding: 20,
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 620,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    padding: "40px 60px",
                }}
            >
                {!emailSent ? (
                    <>
                        <Title level={3} style={{ color: "#040404ff", marginBottom: 8 }}>
                            Quên mật khẩu
                        </Title>
                        <Text type="secondary">
                            Nhập địa chỉ email và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
                        </Text>

                        <Form layout="vertical" size="large" style={{ marginTop: 24 }}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không hợp lệ!" },
                                ]}
                            >
                                <Input placeholder="eg: example@gmail.com" />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                style={{
                                    height: 40,
                                    backgroundColor: "#237486",
                                    borderColor: "#237486",
                                }}
                            >
                                Send email
                            </Button>
                        </Form>

                        <div style={{ marginTop: 16 }}>
                            <Link to="/login" style={{ color: "#333" }}>
                                <ArrowLeftOutlined /> Đăng nhập
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <Title level={3} style={{ color: "#003399" }}>
                            Email đã được gửi
                        </Title>
                        <Text>
                            Vui lòng kiểm tra hộp thư của bạn để đặt lại mật khẩu.
                        </Text>

                        <Button
                            type="primary"
                            style={{
                                marginTop: 24,
                                backgroundColor: "#6c757d",
                                borderColor: "#6c757d",
                            }}
                            onClick={() => setEmailSent(false)}
                        >
                            Gửi lại email
                        </Button>

                        <div style={{ marginTop: 16 }}>
                            <Link to="/login" style={{ color: "#333" }}>
                                <ArrowLeftOutlined /> Quay lại đăng nhập
                            </Link>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
