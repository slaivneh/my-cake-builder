import { useEffect, useState } from "react";
import { getCakeImage } from "../../utils/cakeImage";
import "../../assets/styles/ProductManagement.css";

import {
    getAllCakes,
    deleteCake,
} from "../../services/cakeService";

import ProductModal from "../../components/admin/ProductModal";

function ProductManagement() {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCake, setSelectedCake] = useState(null);

    useEffect(() => {
        loadCakes();
    }, []);

    const loadCakes = async () => {
        try {
            const data = await getAllCakes();
            setCakes(Array.isArray(data) ? data : []);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cake) => {
        setSelectedCake(cake);
    };

    const handleDelete = async (cake) => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${cake.name}"?`)) {
            return;
        }

        try {
            await deleteCake(cake.id);

            setCakes((prev) =>
                prev.filter((item) => item.id !== cake.id)
            );

            alert("Đã xóa sản phẩm.");
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="product-loading">
                Đang tải danh sách sản phẩm...
            </div>
        );
    }

    return (
        <div className="product-management">

            <div className="product-header">

                <div>
                    <h1>Quản lý sản phẩm</h1>

                    <p>
                        Chỉnh sửa thông tin và quản lý trạng thái sản phẩm.
                    </p>
                </div>

            </div>

            <div className="product-table-wrapper">

                <table className="product-table">

                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên bánh</th>
                            <th>Danh mục</th>
                            <th>Giá từ</th>
                            <th>Best Seller</th>
                            <th>Đang bán</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>

                        {cakes.map((cake) => {

                            const minPrice = Math.min(
                                ...cake.priceOptions.map(
                                    (option) => option.price
                                )
                            );

                            return (
                                <tr key={cake.id}>

                                    <td>
                                        <img
                                            className="product-image"
                                            src={getCakeImage(cake.image)}
                                            alt={cake.name}
                                        />
                                    </td>

                                    <td>{cake.name}</td>

                                    <td>{cake.category}</td>

                                    <td>
                                        {minPrice.toLocaleString("vi-VN")} đ
                                    </td>

                                    <td>
                                        {cake.isBestSeller ? "Có" : "-"}
                                    </td>

                                    <td>
                                        {cake.isAvailable ? (
                                            <span className="status-active">
                                                Đang bán
                                            </span>
                                        ) : (
                                            <span className="status-inactive">
                                                Ngừng bán
                                            </span>
                                        )}
                                    </td>

                                    <td>

                                        <div className="product-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(cake)}
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(cake)}
                                            >
                                                Xóa
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

            {selectedCake && (
                <ProductModal
                    cake={selectedCake}
                    onClose={() => {
                        setSelectedCake(null);
                        loadCakes();
                    }}
                />
            )}

        </div>
    );
}

export default ProductManagement;