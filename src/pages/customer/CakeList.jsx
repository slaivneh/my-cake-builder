import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import CakeCard from "../../components/customer/CakeCard";

import { getAllCakes } from "../../services/cakeService";

import { normalizeCakeText } from "../../utils/homeCakeData";

import bannerImage from "../../assets/images/home/bannerList.png";

import "../../assets/styles/cake-list.css";

const PRODUCTS_PER_PAGE = 12;

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

  const requestedPage = Number(searchParams.get("page") || 1);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCakes.length / PRODUCTS_PER_PAGE),
  );

  const currentPage = Math.min(
    Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1),
    totalPages,
  );

  const displayedCakes = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return filteredCakes.slice(startIndex, endIndex);
  }, [filteredCakes, currentPage]);

  const firstDisplayedProduct =
    filteredCakes.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const lastDisplayedProduct = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredCakes.length,
  );

  const updatePageParameter = (pageNumber) => {
    const nextParams = new URLSearchParams(searchParams);

    if (pageNumber <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(pageNumber));
    }

    setSearchParams(nextParams);
  };

  const resetToFirstPage = (nextParams) => {
    nextParams.delete("page");

    setSearchParams(nextParams);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    const nextParams = new URLSearchParams(searchParams);

    if (value === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", value);
    }

    resetToFirstPage(nextParams);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);

    if (currentPage !== 1) {
      updatePageParameter(1);
    }
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);

    if (currentPage !== 1) {
      updatePageParameter(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === currentPage
    ) {
      return;
    }

    updatePageParameter(pageNumber);

    window.setTimeout(() => {
      document.querySelector(".pd-cake-list-container")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
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
            <span aria-hidden="true">⌕</span>

            <input
              type="text"
              value={keyword}
              placeholder="Tìm kiếm tên bánh..."
              onChange={handleKeywordChange}
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

          <select value={sortType} onChange={handleSortChange}>
            <option value="default">Sắp xếp mặc định</option>

            <option value="price-asc">Giá thấp đến cao</option>

            <option value="price-desc">Giá cao đến thấp</option>

            <option value="name-asc">Tên A đến Z</option>
          </select>
        </div>

        {!loading && !error && (
          <div className="pd-cake-list-result">
            <p className="pd-cake-list-count">
              Tìm thấy <strong>{filteredCakes.length}</strong> sản phẩm
            </p>

            {filteredCakes.length > 0 && (
              <p className="pd-cake-list-range">
                Hiển thị{" "}
                <strong>
                  {firstDisplayedProduct}–{lastDisplayedProduct}
                </strong>{" "}
                trong <strong>{filteredCakes.length}</strong> sản phẩm
              </p>
            )}
          </div>
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

        {!loading && !error && displayedCakes.length > 0 && (
          <>
            <div className="pd-cake-list-grid">
              {displayedCakes.map((cake) => (
                <CakeCard
                  key={cake.id}
                  cake={cake}
                  showBestSellerBadge={cake.isBestSeller === true}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="pd-cake-pagination"
                aria-label="Phân trang danh sách bánh"
              >
                <button
                  type="button"
                  className="pd-cake-pagination__control"
                  disabled={currentPage === 1}
                  onClick={() => {
                    handlePageChange(currentPage - 1);
                  }}
                >
                  ← Trước
                </button>

                <div className="pd-cake-pagination__numbers">
                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={
                        pageNumber === currentPage
                          ? "pd-cake-pagination__page pd-cake-pagination__page--active"
                          : "pd-cake-pagination__page"
                      }
                      aria-current={
                        pageNumber === currentPage ? "page" : undefined
                      }
                      onClick={() => {
                        handlePageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pd-cake-pagination__control"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    handlePageChange(currentPage + 1);
                  }}
                >
                  Sau →
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default CakeList;
