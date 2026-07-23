import { useEffect, useState } from "react";

import { updateCake } from "../../services/cakeService";
import { getCakeImage } from "../../utils/cakeImage";

const defaultForm = {
    id: "",
    name: "",
    category: "",
    description: "",
    image: "",
    slug: "",
    pricingType: "quantity",

    isAvailable: true,
    isBestSeller: false,
    isFeatured: false,

    priceOptions: [],
};

function ProductModal({ cake, onClose }) {
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!cake) return;

        setForm({
            ...cake,
            priceOptions: cake.priceOptions.map((item) => ({ ...item })),
        });
    }, [cake]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePriceChange = (index, field, value) => {
        const updated = [...form.priceOptions];

        updated[index][field] =
            field === "price" ? Number(value) : value;

        setForm((prev) => ({
            ...prev,
            priceOptions: updated,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await updateCake(form.id, form);

            alert("Cập nhật sản phẩm thành công!");

            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!cake) return null;

    return (
        <div className="modal-overlay">
            <div className="product-modal">

                <h2>Chỉnh sửa sản phẩm</h2>

                <form onSubmit={handleSave}>

                    <div className="product-image-preview">
                        <label>Hình ảnh</label>

                        <img
                            src={getCakeImage(form.image)}
                            alt={form.name}
                            className="preview-image"
                        />

                        <small>
                            Hình ảnh sản phẩm không thể chỉnh sửa.
                        </small>
                    </div>

                    <label>
                        Tên bánh

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Danh mục

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            <option value="Cupcake">Cupcake</option>
                            <option value="Birthday Cake">
                                Birthday Cake
                            </option>
                            <option value="Bento Cake">
                                Bento Cake
                            </option>
                            <option value="Cookie">
                                Cookie
                            </option>
                            <option value="Macaron">
                                Macaron
                            </option>
                        </select>
                    </label>

                    <label>
                        Mô tả

                        <textarea
                            rows={4}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </label>

                    <h3>Các mức giá</h3>

                    {form.priceOptions.map((option, index) => (
                        <div
                            className="price-option"
                            key={option.id}
                        >
                            <input
                                value={option.label}
                                onChange={(e) =>
                                    handlePriceChange(
                                        index,
                                        "label",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                value={option.price}
                                onChange={(e) =>
                                    handlePriceChange(
                                        index,
                                        "price",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    ))}

                    <div className="checkbox-group">

                        <label>
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={form.isAvailable}
                                onChange={handleChange}
                            />

                            Đang bán
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="isBestSeller"
                                checked={form.isBestSeller}
                                onChange={handleChange}
                            />

                            Best Seller
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                            />

                            Featured
                        </label>

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default ProductModal;