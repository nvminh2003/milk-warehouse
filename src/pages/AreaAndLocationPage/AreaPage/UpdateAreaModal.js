import React from "react";
import { Modal, Form, Divider, Row, Col, Input, InputNumber, Select } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Option } = Select;

const UpdateAreaModal = ({
    isVisible,
    onCancel,
    onSubmit,
    form,
    loading = false
}) => {
    return (
        <Modal
            title={
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                    Cập nhật khu vực
                </span>
            }
            open={isVisible}
            onCancel={onCancel}
            onOk={onSubmit}
            okText="Cập nhật"
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
                            <InputNumber 
                                placeholder="VD: 1" 
                                style={{ width: "100%" }}
                                min={1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
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
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item name="description" label="Mô tả">
                            <Input.TextArea 
                                rows={3} 
                                placeholder="Nhập mô tả khu vực (nếu có)" 
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateAreaModal;
