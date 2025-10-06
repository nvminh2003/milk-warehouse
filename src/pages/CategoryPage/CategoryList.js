import React, { useEffect, useState } from "react";
import { getCategory } from "../../services/CategoryServices";

function CategoryList() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCategory();
            setCategories(data.data); // dựa vào cấu trúc trả về trong Swagger
        };
        fetchData();
    }, []);

    return (
        <div>
            <h3>Danh sách danh mục</h3>
            <ul>
                {categories.map((cat, index) => (
                    <li key={index}>
                        <strong>{cat.categoryName}</strong>: {cat.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryList;
