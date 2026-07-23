import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import CakeCard from "../../components/customer/CakeCard";

import { getAllCakes } from "../../services/cakeService";

import { normalizeCakeText } from "../../utils/homeCakeData";

import bannerImage from "../../assets/images/home/bannerList.png";

import "../../assets/styles/cake-list.css";

const getMinimumPrice = (cake) => {
  if (Array.isArray(cake?.priceOptions) && cake.priceOptions.length > 0) {
    const prices = cake.priceOptions
      .map((option) => {
        return Number(option.price);
      })
      .filter((price) => {
        return !Number.isNaN(price);
      });

    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  return Number(cake?.price || 0);
};

function CakeList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cakes, setCakes] = useState([]);

  const [keyword, setKeyword] = useState("");

  const [sortType, setSortType] = useState("default");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const selectedCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAllCakes();

        setCakes(Array.isArray(result) ? result : []);
      } catch (fetchError) {
        console.error("Không tải được bánh:", fetchError);

        setError(fetchError.message || "Không thể tải danh sách bánh.");
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set();

    cakes.forEach((cake) => {
      if (cake?.category) {
        categorySet.add(cake.category);
      }
    });

    return Array.from(categorySet).sort((first, second) => {
      return first.localeCompare(second, "vi");
    });
  }, [cakes]);

  const filteredCakes = useMemo(() => {
    const normalizedKeyword = normalizeCakeText(keyword);

    const result = cakes.filter((cake) => {
      const matchesAvailable = cake.isAvailable !== false;

      const matchesCategory =
        selectedCategory === "all" ||
        normalizeCakeText(cake.category) ===
          normalizeCakeText(selectedCategory);

      const searchContent = normalizeCakeText(
        [cake.name, cake.category, cake.description].join(" "),
      );

      const matchesKeyword =
        !normalizedKeyword || searchContent.includes(normalizedKeyword);

      return matchesAvailable && matchesCategory && matchesKeyword;
    });

    return [...result].sort((first, second) => {
      if (sortType === "price-asc") {
        return getMinimumPrice(first) - getMinimumPrice(second);
      }

      if (sortType === "price-desc") {
        return getMinimumPrice(second) - getMinimumPrice(first);
      }

      if (sortType === "name-asc") {
        return String(first.name || "").localeCompare(
          String(second.name || ""),
          "vi",
        );
      }

      return (
        Number(first.displayOrder ?? first.id ?? 0) -
        Number(second.displayOrder ?? second.id ?? 0)
      );
    });
  }, [cakes, keyword, selectedCategory, sortType]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    if (value === "all") {
      setSearchParams({});

      return;
    }

    setSearchParams({
      category: value,
    });
  };

  return (
    <main className="pd-cake-list-page">
      <section className="pd-cake-list-banner">
        <img src={bannerImage} alt="Bộ sưu tập bánh ngọt Petite Douceur" />
      </section>

      <section className="pd-cake-list-container">
        <header className="pd-cake-list-heading">
          <p>Petite Douceur</p>

          <h1>Danh sách bánh</h1>

          <span>
            Khám phá những chiếc bánh nhỏ xinh cho mọi khoảnh khắc ngọt ngào.
          </span>
        </header>

        <div className="pd-cake-list-toolbar">
          <div className="pd-cake-list-search">
            <span>⌕</span>

            <input
              type="text"
              value={keyword}
              placeholder="Tìm kiếm tên bánh..."
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
            />
          </div>

          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">Tất cả danh mục</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortType}
            onChange={(event) => {
              setSortType(event.target.value);
            }}
          >
            <option value="default">Sắp xếp mặc định</option>

            <option value="price-asc">Giá thấp đến cao</option>

            <option value="price-desc">Giá cao đến thấp</option>

            <option value="name-asc">Tên A đến Z</option>
          </select>
        </div>

        {!loading && !error && (
          <p className="pd-cake-list-count">
            Tìm thấy <strong>{filteredCakes.length}</strong> sản phẩm
          </p>
        )}

        {loading && (
          <div className="pd-cake-list-state">Đang tải danh sách bánh...</div>
        )}

        {!loading && error && (
          <div className="pd-cake-list-state">
            <h2>Không tải được danh sách bánh</h2>

            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredCakes.length === 0 && (
          <div className="pd-cake-list-state">Không tìm thấy bánh phù hợp.</div>
        )}

        {!loading && !error && filteredCakes.length > 0 && (
          <div className="pd-cake-list-grid">
            {filteredCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                showBestSellerBadge={cake.isBestSeller === true}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CakeList;
