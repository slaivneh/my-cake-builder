import heroImage from "../assets/images/home/thumbnail.png";

import customizeBannerImage from "../assets/images/home/cutomize now.png";

import { getCakeImage } from "./cakeImage";

/*
  Ảnh giao diện của trang Home.
*/
export const HOME_HERO_IMAGE = heroImage;

export const CUSTOMIZE_BANNER_IMAGE = customizeBannerImage;

/*
  Danh mục đại diện trang Home.

  Các ảnh này được lấy từ:
  src/assets/images/cakes/
*/
export const HOME_CATEGORIES = [
  {
    id: "cupcake",

    name: "Cupcake",
    title: "Cupcake",
    label: "Cupcake",
    value: "Cupcake",
    category: "Cupcake",

    image: getCakeImage("cupcake_dau_hong.jpg", "Cupcake Dâu Kem Hồng"),

    to: "/cakes?category=Cupcake",
    link: "/cakes?category=Cupcake",
    path: "/cakes?category=Cupcake",

    description: "Cupcake nhỏ xinh với lớp kem trang trí ngọt ngào.",
  },

  {
    id: "mini-cake",

    name: "Mini Cake",
    title: "Mini Cake",
    label: "Mini Cake",
    value: "Mini Cake",
    category: "Mini Cake",

    image: getCakeImage("mini cake dau pastel.jpg", "Mini Cake Dâu Pastel"),

    to: "/cakes?category=Mini%20Cake",

    link: "/cakes?category=Mini%20Cake",

    path: "/cakes?category=Mini%20Cake",

    description: "Bánh kem mini phù hợp với những buổi tiệc nhỏ.",
  },

  {
    id: "tart",

    name: "Tart",
    title: "Tart",
    label: "Tart",
    value: "Tart",
    category: "Tart",

    image: getCakeImage("tart dau vanilla.jpg", "Tart Dâu Vanilla"),

    to: "/cakes?category=Tart",
    link: "/cakes?category=Tart",
    path: "/cakes?category=Tart",

    description: "Đế tart bơ giòn kết hợp với kem mềm và trái cây.",
  },

  {
    id: "bento-cake",

    name: "Bento Cake",
    title: "Bento Cake",
    label: "Bento Cake",
    value: "Bento Cake",
    category: "Bento Cake",

    image: getCakeImage("bento cake hoa nhi.jpg", "Bento Cake Hoa Nhí"),

    to: "/cakes?category=Bento%20Cake",

    link: "/cakes?category=Bento%20Cake",

    path: "/cakes?category=Bento%20Cake",

    description: "Bánh bento nhỏ gọn với lời nhắn theo yêu cầu.",
  },
];

export const normalizeCakeText = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
};

/*
  CakeCard, Home và CakeDetail đều có thể
  gọi hàm này để lấy ảnh bánh.
*/
export const getCakeHomeImage = (cake) => {
  if (!cake) {
    return "";
  }

  return getCakeImage(cake.image, cake.name);
};

export const getBestSellerCakes = (cakes = [], limit = 4) => {
  if (!Array.isArray(cakes)) {
    return [];
  }

  const availableCakes = cakes
    .filter((cake) => {
      return cake?.isAvailable !== false;
    })
    .sort((first, second) => {
      const firstOrder = Number(first.displayOrder ?? first.id ?? 0);

      const secondOrder = Number(second.displayOrder ?? second.id ?? 0);

      return firstOrder - secondOrder;
    });

  const markedBestSellers = availableCakes.filter((cake) => {
    return cake?.isBestSeller === true;
  });

  if (markedBestSellers.length >= limit) {
    return markedBestSellers.slice(0, limit);
  }

  const selectedIds = new Set(
    markedBestSellers.map((cake) => {
      return String(cake.id);
    }),
  );

  const remainingCakes = availableCakes.filter((cake) => {
    return !selectedIds.has(String(cake.id));
  });

  return [...markedBestSellers, ...remainingCakes].slice(0, limit);
};
