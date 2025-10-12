import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import {
    MailOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/AuthenticationServices";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await forgotPassword(values.email);
            const successMsg =
                res?.message || "Đã gửi email khôi phục mật khẩu!";
            window.showToast(successMsg);
            console.log("ForgotPassword response:", res);
            setEmailSent(true);
        } catch (err) {
            const errorMsg =
                err?.response?.data?.message?.replace(/^\[.*?\]\s*/, "") ||
                err?.message ||
                "Có lỗi xảy ra, vui lòng thử lại!";
            window.showToast(errorMsg);
            console.error(err);
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
                    maxWidth: 500,
                    borderRadius: 16,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    textAlign: "center",
                    padding: "48px 40px",
                }}
            >
                {!emailSent ? (
                    <>
                        <Title
                            level={3}
                            style={{ color: "#237486", marginBottom: 8 }}
                        >
                            Quên mật khẩu
                        </Title>
                        <Text type="secondary">
                            Nhập địa chỉ email và chúng tôi sẽ gửi liên kết để
                            đặt lại mật khẩu.
                        </Text>

                        <Form
                            layout="vertical"
                            size="large"
                            onFinish={onFinish}
                            style={{ marginTop: 24 }}
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không hợp lệ!" },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="vd: example@gmail.com"
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                style={{
                                    height: 42,
                                    backgroundColor: "#237486",
                                    borderColor: "#237486",
                                    borderRadius: 8,
                                    fontWeight: 500,
                                }}
                            >
                                Gửi email
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
                        <CheckCircleOutlined
                            style={{
                                fontSize: 60,
                                color: "#28a745",
                                marginBottom: 16,
                            }}
                        />
                        <Title
                            level={3}
                            style={{ color: "#237486", marginBottom: 8 }}
                        >
                            Email đã được gửi!
                        </Title>
                        <Text type="secondary">
                            Vui lòng kiểm tra hộp thư của bạn để đặt lại mật khẩu.
                        </Text>

                        <Button
                            type="primary"
                            block
                            style={{
                                marginTop: 24,
                                backgroundColor: "#237486",
                                borderColor: "#237486",
                                borderRadius: 8,
                                height: 42,
                            }}
                            onClick={() => setEmailSent(false)}
                        >
                            Gửi lại email
                        </Button>

                        <div style={{ marginTop: 20 }}>
                            <Link
                                to="/login"
                                style={{
                                    color: "#237486",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                }}
                            >
                                <ArrowLeftOutlined style={{ marginRight: 6 }} />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
