import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import CakeCard from "../../components/customer/CakeCard";

import { getAllCakes } from "../../services/cakeService";

import { normalizeCakeText } from "../../utils/homeCakeData";

import bannerListImage from "../../assets/images/home/bannerList.png";

import "../../assets/styles/cake.css";
import "../../assets/styles/cake-list.css";

const PAGE_SIZE = 8;

const getCakeMinimumPrice = (cake) => {
  const directPrice = Number(cake?.price);

  if (
    cake?.price !== undefined &&
    cake?.price !== null &&
    !Number.isNaN(directPrice)
  ) {
    return directPrice;
  }

  if (!Array.isArray(cake?.priceOptions) || cake.priceOptions.length === 0) {
    return 0;
  }

  const prices = cake.priceOptions
    .map((option) => Number(option.price))
    .filter((price) => !Number.isNaN(price));

  return prices.length > 0 ? Math.min(...prices) : 0;
};

const canDisplayCake = (cake) => {
  const normalizedStatus = normalizeCakeText(cake?.status || "");

  return (
    cake?.isActive !== false &&
    cake?.active !== false &&
    normalizedStatus !== "inactive" &&
    normalizedStatus !== "disabled"
  );
};

function CakeList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cakes, setCakes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const keyword = searchParams.get("q") || "";

  const category = searchParams.get("category") || "";

  const sort = searchParams.get("sort") || "default";

  const requestedPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoading(true);
        setError("");

        const cakeData = await getAllCakes();

        setCakes(Array.isArray(cakeData) ? cakeData : []);
      } catch (fetchError) {
        console.error("Lỗi tải danh sách bánh:", fetchError);

        setError("Không thể tải danh sách bánh. Hãy kiểm tra API Server.");
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

    return Array.from(categorySet).sort((first, second) =>
      first.localeCompare(second, "vi"),
    );
  }, [cakes]);

  const filteredCakes = useMemo(() => {
    const normalizedKeyword = normalizeCakeText(keyword);

    const normalizedCategory = normalizeCakeText(category);

    const result = cakes.filter((cake) => {
      if (!canDisplayCake(cake)) {
        return false;
      }

      const cakeName = normalizeCakeText(cake?.name || "");

      const cakeCategory = normalizeCakeText(cake?.category || "");

      const cakeDescription = normalizeCakeText(cake?.description || "");

      const matchesKeyword =
        !normalizedKeyword ||
        cakeName.includes(normalizedKeyword) ||
        cakeDescription.includes(normalizedKeyword);

      const matchesCategory =
        !normalizedCategory || cakeCategory === normalizedCategory;

      return matchesKeyword && matchesCategory;
    });

    if (sort === "price-asc") {
      result.sort(
        (first, second) =>
          getCakeMinimumPrice(first) - getCakeMinimumPrice(second),
      );
    }

    if (sort === "price-desc") {
      result.sort(
        (first, second) =>
          getCakeMinimumPrice(second) - getCakeMinimumPrice(first),
      );
    }

    if (sort === "name-asc") {
      result.sort((first, second) =>
        String(first?.name || "").localeCompare(
          String(second?.name || ""),
          "vi",
        ),
      );
    }

    if (sort === "name-desc") {
      result.sort((first, second) =>
        String(second?.name || "").localeCompare(
          String(first?.name || ""),
          "vi",
        ),
      );
    }

    return result;
  }, [cakes, keyword, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredCakes.length / PAGE_SIZE));

  const currentPage = Math.min(requestedPage, totalPages);

  const paginatedCakes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredCakes.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCakes, currentPage]);

  const updateSearchParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === "default"
      ) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    updateSearchParams({
      q: searchInput.trim(),
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const pageNumbers = Array.from(
    {
      length: totalPages,
    },
    (_, index) => index + 1,
  );

  return (
    <div className="pd-cake-list-page">
      {/* Banner */}

      <section
        className="pd-cake-list-banner"
        aria-label="Bộ sưu tập bánh ngọt Petite Douceur"
      >
        <img src={bannerListImage} alt="Bộ sưu tập bánh ngọt Petite Douceur" />
      </section>

      {/* Tìm kiếm và lọc */}

      <section className="pd-cake-toolbar">
        <form className="pd-cake-search" onSubmit={handleSearch}>
          <span className="pd-cake-search__icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="text"
            value={searchInput}
            placeholder="Tìm kiếm tên bánh..."
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />

          <button type="submit">Tìm kiếm</button>
        </form>

        <select
          value={category}
          onChange={(event) => {
            updateSearchParams({
              category: event.target.value,
            });
          }}
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>

          {categories.map((categoryItem) => (
            <option key={categoryItem} value={categoryItem}>
              {categoryItem}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => {
            updateSearchParams({
              sort: event.target.value,
            });
          }}
          aria-label="Sắp xếp sản phẩm"
        >
          <option value="default">Sắp xếp mặc định</option>

          <option value="price-asc">Giá thấp đến cao</option>

          <option value="price-desc">Giá cao đến thấp</option>

          <option value="name-asc">Tên A đến Z</option>

          <option value="name-desc">Tên Z đến A</option>
        </select>
      </section>

      {/* Kết quả */}

      <div className="pd-cake-result-header">
        <p>
          Tìm thấy <strong>{filteredCakes.length}</strong> sản phẩm
        </p>

        {(keyword || category || sort !== "default") && (
          <button type="button" onClick={handleClearFilters}>
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Loading */}

      {loading && (
        <div className="pd-cake-list-loading">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="pd-cake-empty">
          <h2>Không tải được sản phẩm</h2>

          <p>{error}</p>
        </div>
      )}

      {/* Danh sách bánh */}

      {!loading && !error && paginatedCakes.length > 0 && (
        <div className="pd-cake-list-grid">
          {paginatedCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      )}

      {/* Không có kết quả */}

      {!loading && !error && paginatedCakes.length === 0 && (
        <div className="pd-cake-empty">
          <h2>Không tìm thấy bánh phù hợp</h2>

          <p>Hãy thử tìm kiếm bằng tên bánh hoặc chọn danh mục khác.</p>

          <button type="button" onClick={handleClearFilters}>
            Xem tất cả bánh
          </button>
        </div>
      )}

      {/* Phân trang */}

      {!loading && !error && totalPages > 1 && (
        <nav
          className="pd-cake-pagination"
          aria-label="Phân trang danh sách bánh"
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              updateSearchParams({
                page: currentPage - 1,
              });
            }}
            aria-label="Trang trước"
          >
            ←
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              className={
                page === currentPage ? "pd-cake-pagination__active" : ""
              }
              onClick={() => {
                updateSearchParams({
                  page,
                });
              }}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => {
              updateSearchParams({
                page: currentPage + 1,
              });
            }}
            aria-label="Trang tiếp theo"
          >
            →
          </button>
        </nav>
      )}
    </div>
  );
}

export default CakeList;
