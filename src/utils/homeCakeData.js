import bentoFlowerImage from "../assets/images/home/bento cake hoa nhi.jpg";
import chouxStrawberryImage from "../assets/images/home/choux kem dau.jpg";
import cupcakeCherryImage from "../assets/images/home/cupcake_cherry_vanilla.jpg";
import cupcakeStrawberryImage from "../assets/images/home/cupcake_dau_hong.jpg";
import cupcakeFlowerImage from "../assets/images/home/cupcake_hoa_kem_bo.jpg";
import cupcakeMatchaImage from "../assets/images/home/cupcake_match_dau.jpg";
import customizeBannerImage from "../assets/images/home/cutomize now.png";
import macaronImage from "../assets/images/home/macaron dau hong.jpg";
import mangoPuddingImage from "../assets/images/home/mango pudding mini cake.jpg";
import miniPastelImage from "../assets/images/home/mini cake dau pastel.jpg";
import miniBlueberryImage from "../assets/images/home/mini cake viet quat kem sua.jpg";
import miniHeartImage from "../assets/images/home/mini trai tim mam xoi.jpg";
import rollCakeImage from "../assets/images/home/roll cake dau kem sua.jpg";
import lemonTartImage from "../assets/images/home/tart chanh.jpg";
import vanillaTartImage from "../assets/images/home/tart dau vanilla.jpg";
import heroImage from "../assets/images/home/thumbnail.png";

/* =====================================================
   ẢNH BANNER
   ===================================================== */

export const HOME_HERO_IMAGE = heroImage;

export const CUSTOMIZE_BANNER_IMAGE = customizeBannerImage;

/* =====================================================
   CHUẨN HÓA CHỮ
   ===================================================== */

export const normalizeCakeText = (value = "") => {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

/* =====================================================
   DANH MỤC TRÊN HOME
   ===================================================== */

/*
  Các ảnh danh mục chỉ đóng vai trò đại diện.

  Những ảnh này được chọn khác với
  bốn ảnh bánh bán chạy bên dưới.
*/
export const HOME_CATEGORIES = [
  {
    label: "Cupcake",
    image: cupcakeFlowerImage,
  },
  {
    label: "Mini Cake",
    image: mangoPuddingImage,
  },
  {
    label: "Tart",
    image: vanillaTartImage,
  },
  {
    label: "Bento Cake",
    image: bentoFlowerImage,
  },
];

/* =====================================================
   GHÉP ẢNH THEO TÊN BÁNH
   ===================================================== */

const cakeImageRules = [
  {
    keywords: [
      "cupcake dau hong",
      "cupcake dau kem hong",
      "cupcake strawberry",
    ],
    image: cupcakeStrawberryImage,
  },
  {
    keywords: ["cupcake hoa kem bo", "cupcake hoa"],
    image: cupcakeFlowerImage,
  },
  {
    keywords: ["cupcake cherry vanilla", "cupcake cherry vanila"],
    image: cupcakeCherryImage,
  },
  {
    keywords: ["cupcake matcha dau", "cupcake match dau"],
    image: cupcakeMatchaImage,
  },
  {
    keywords: ["mini cake dau pastel", "cake dau pastel"],
    image: miniPastelImage,
  },
  {
    keywords: [
      "mini cake trai tim mam xoi",
      "mini trai tim mam xoi",
      "trai tim mam xoi",
    ],
    image: miniHeartImage,
  },
  {
    keywords: [
      "mini cake viet quat kem sua",
      "mini cake viet quat",
      "viet quat kem sua",
    ],
    image: miniBlueberryImage,
  },
  {
    keywords: ["bento cake hoa nhi", "bento hoa nhi"],
    image: bentoFlowerImage,
  },
  {
    keywords: ["mango pudding mini cake", "mango pudding", "pudding xoai"],
    image: mangoPuddingImage,
  },
  {
    keywords: ["tart dau vanilla", "tart dau vanila", "tart dau"],
    image: vanillaTartImage,
  },
  {
    keywords: ["tart chanh meringue", "tart chanh", "lemon tart"],
    image: lemonTartImage,
  },
  {
    keywords: ["choux kem dau", "choux dau", "su kem dau"],
    image: chouxStrawberryImage,
  },
  {
    keywords: ["macaron dau hong", "macaron dau"],
    image: macaronImage,
  },
  {
    keywords: ["roll cake dau kem sua", "roll cake dau", "bong lan cuon dau"],
    image: rollCakeImage,
  },
];

const getCakeName = (cake) => {
  return normalizeCakeText(cake?.name || cake?.cakeName || cake?.title || "");
};

const matchesCakeKeyword = (cake, keyword) => {
  const cakeName = getCakeName(cake);

  const normalizedKeyword = normalizeCakeText(keyword);

  return (
    cakeName === normalizedKeyword ||
    cakeName.includes(normalizedKeyword) ||
    normalizedKeyword.includes(cakeName)
  );
};

export const getCakeHomeImage = (cake) => {
  const matchedRule = cakeImageRules.find((rule) => {
    return rule.keywords.some((keyword) => {
      return matchesCakeKeyword(cake, keyword);
    });
  });

  if (matchedRule) {
    return matchedRule.image;
  }

  if (Array.isArray(cake?.images) && cake.images.length > 0) {
    return cake.images[0];
  }

  if (cake?.image) {
    return cake.image;
  }

  return cupcakeStrawberryImage;
};

/* =====================================================
   BÁNH BÁN CHẠY
   ===================================================== */

/*
  Đây là bốn bánh ưu tiên cho phần bán chạy.

  Các ảnh đều khác với ảnh đại diện category:
  - Cupcake Dâu Hồng
  - Mini Cake Dâu Pastel
  - Tart Chanh
  - Roll Cake Dâu Kem Sữa
*/
const BEST_SELLER_PRIORITY_RULES = [
  ["cupcake dau hong", "cupcake dau kem hong"],
  ["mini cake dau pastel"],
  ["tart chanh", "tart chanh meringue"],
  ["roll cake dau kem sua", "roll cake dau"],
];

/*
  Các bánh đang được dùng làm ảnh danh mục.

  Chúng sẽ không được đưa vào bánh bán chạy
  để tránh hai mục có hình giống nhau.
*/
const CATEGORY_PREVIEW_RULES = [
  ["cupcake hoa kem bo"],
  ["mango pudding mini cake"],
  ["tart dau vanilla", "tart dau vanila"],
  ["bento cake hoa nhi"],
];

const isCategoryPreviewCake = (cake) => {
  return CATEGORY_PREVIEW_RULES.some((keywords) => {
    return keywords.some((keyword) => {
      return matchesCakeKeyword(cake, keyword);
    });
  });
};

const isCakeAvailable = (cake) => {
  const status = normalizeCakeText(cake?.status || "");

  return (
    cake?.isAvailable !== false &&
    cake?.isActive !== false &&
    cake?.active !== false &&
    status !== "inactive" &&
    status !== "disabled"
  );
};

const isMarkedBestSeller = (cake) => {
  return (
    cake?.isBestSeller === true ||
    cake?.bestSeller === true ||
    cake?.isFeatured === true ||
    cake?.featured === true
  );
};

const addUniqueCake = (result, usedKeys, cake) => {
  if (!cake) {
    return;
  }

  const key = String(cake.id ?? cake.name ?? cake.cakeName ?? cake.title);

  if (usedKeys.has(key)) {
    return;
  }

  usedKeys.add(key);
  result.push(cake);
};

export const getBestSellerCakes = (cakes = []) => {
  const availableCakes = cakes.filter(isCakeAvailable);

  const result = [];
  const usedKeys = new Set();

  /*
    Bước 1:
    Ưu tiên lấy đúng bốn sản phẩm đã chọn.
  */
  BEST_SELLER_PRIORITY_RULES.forEach((keywords) => {
    const matchedCake = availableCakes.find((cake) => {
      return keywords.some((keyword) => {
        return matchesCakeKeyword(cake, keyword);
      });
    });

    addUniqueCake(result, usedKeys, matchedCake);
  });

  /*
    Bước 2:
    Nếu chưa đủ 4 thì lấy bánh có đánh dấu
    isBestSeller hoặc isFeatured.

    Loại bỏ bánh đang dùng làm ảnh danh mục.
  */
  availableCakes
    .filter((cake) => {
      return isMarkedBestSeller(cake) && !isCategoryPreviewCake(cake);
    })
    .forEach((cake) => {
      if (result.length < 4) {
        addUniqueCake(result, usedKeys, cake);
      }
    });

  /*
    Bước 3:
    Nếu vẫn chưa đủ thì lấy bánh còn lại,
    nhưng vẫn tránh ảnh danh mục.
  */
  availableCakes
    .filter((cake) => {
      return !isCategoryPreviewCake(cake);
    })
    .forEach((cake) => {
      if (result.length < 4) {
        addUniqueCake(result, usedKeys, cake);
      }
    });

  /*
    Trường hợp DB có quá ít bánh,
    mới cho phép lấy sản phẩm bất kỳ.
  */
  availableCakes.forEach((cake) => {
    if (result.length < 4) {
      addUniqueCake(result, usedKeys, cake);
    }
  });

  return result.slice(0, 4);
};
