import React, { useState, useEffect } from "react";
import { Input, Select, Button, Space, Row, Col, Typography, DatePicker } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

/**
 * BaseFilter Component
 *
 * Props:
 * - onFilterChange: (params) => void
 * - filtersConfig: [{ label, name, type, options }]
 * - showSearch: boolean
 * - showSort: boolean
 * - defaultSortField: string
 * - placeholderSearch: string
 * - applyMode: "auto" | "manual"
 */

const BaseFilter = ({
    onFilterChange,
    filtersConfig = [],
    showSearch = true,
    defaultSortField = "",
    placeholderSearch = "Tìm kiếm...",
    applyMode = "auto",
}) => {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [sortField, setSortField] = useState(defaultSortField);
    const [sortAscending, setSortAscending] = useState(true);
    const [pending, setPending] = useState({
        search: "",
        filters: {},
        sortField: defaultSortField,
        sortAscending: true,
    });

    useEffect(() => {
        if (applyMode === "auto") {
            const delay = setTimeout(() => triggerChange(), 500);
            return () => clearTimeout(delay);
        }
    }, [search, filters, sortField, sortAscending, applyMode]);

    const triggerChange = () => {
        onFilterChange({
            pageNumber: 1,
            pageSize: 10,
            search,
            filters,
            sortField,
            sortAscending,
        });
    };

    const handleFilterChange = (name, value) => {
        if (applyMode === "manual") {
            setPending((prev) => ({
                ...prev,
                filters: { ...prev.filters, [name]: value },
            }));
        } else {
            setFilters((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleReset = () => {
        setSearch("");
        setFilters({});
        setSortField(defaultSortField);
        setSortAscending(true);
        setPending({
            search: "",
            filters: {},
            sortField: defaultSortField,
            sortAscending: true,
        });

        onFilterChange({
            pageNumber: 1,
            pageSize: 10,
            search: "",
            filters: {},
            sortField: defaultSortField,
            sortAscending: true,
        });
    };

    const handleApply = () => {
        setSearch(pending.search);
        setFilters(pending.filters);
        setSortField(pending.sortField);
        setSortAscending(pending.sortAscending);
        onFilterChange({
            pageNumber: 1,
            pageSize: 10,
            search: pending.search,
            filters: pending.filters,
            sortField: pending.sortField,
            sortAscending: pending.sortAscending,
        });
    };

    const handleCancel = () => {
        setPending({
            search,
            filters,
            sortField,
            sortAscending,
        });
    };

    const currentSearch = applyMode === "manual" ? pending.search : search;
    const currentFilters = applyMode === "manual" ? pending.filters : filters;

    return (
        <div
            style={{
                marginBottom: 16,
                background: "#fff",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
        >
            {/* 🔍 Hàng tìm kiếm riêng */}
            {showSearch && (
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 8 }}>
                    <Col span={24}>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            <Text strong style={{ marginBottom: 4 }}>
                                Tìm kiếm
                            </Text>
                            <Input
                                allowClear
                                prefix={<SearchOutlined />}
                                placeholder={placeholderSearch}
                                value={currentSearch}
                                onChange={(e) =>
                                    applyMode === "manual"
                                        ? setPending((p) => ({ ...p, search: e.target.value }))
                                        : setSearch(e.target.value)
                                }
                            />
                        </div>
                    </Col>
                </Row>
            )}

            {/* 🧩 Hàng các filter khác */}
            {filtersConfig.length > 0 && (
                <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{
                        flexWrap: "wrap",
                    }}
                >
                    {filtersConfig.map((filter) => (
                        <Col key={filter.name} xs={24} sm={12} md={8} lg={8} xl={4}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <Text strong style={{ marginBottom: 4 }}>
                                    {filter.label}
                                </Text>

                                {filter.type === "select" ? (
                                    <Select
                                        allowClear
                                        style={{ width: "100%" }}
                                        placeholder={`Chọn ${filter.label.toLowerCase()}`}
                                        value={currentFilters[filter.name]}
                                        onChange={(val) => handleFilterChange(filter.name, val)}
                                        options={filter.options}
                                    />
                                ) : filter.type === "date" ? (
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        format="DD/MM/YYYY"
                                        placeholder={`Chọn ${filter.label.toLowerCase()}`}
                                        value={currentFilters[filter.name]}
                                        onChange={(date, dateString) =>
                                            handleFilterChange(filter.name, dateString)
                                        }
                                    />
                                ) : (
                                    <Input
                                        placeholder={`Nhập ${filter.label.toLowerCase()}`}
                                        value={currentFilters[filter.name]}
                                        onChange={(e) =>
                                            handleFilterChange(filter.name, e.target.value)
                                        }
                                    />
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* 🔘 Hàng nút hành động riêng */}
            <Row justify="end" style={{ marginTop: 16 }}>
                <Col>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Làm mới
                        </Button>
                        {applyMode === "manual" && (
                            <>
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: "#237486",
                                        borderColor: "#237486",
                                    }}
                                    onClick={handleApply}
                                >
                                    Áp dụng
                                </Button>
                                <Button onClick={handleCancel}>Hủy bỏ</Button>
                            </>
                        )}
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default BaseFilter;
