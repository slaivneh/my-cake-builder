/*
  Tự động đọc toàn bộ ảnh trong:

  src/assets/images/cakes/

  Database chỉ lưu đúng tên file:

  "image": "cupcake_dau_hong.jpg"

  Không tìm gần đúng.
  Không tự đoán ảnh theo tên bánh.
  Vì tìm gần đúng có thể lấy sai ảnh.
*/

const cakeImageContext = require.context(
  "../assets/images/cakes",
  false,
  /\.(png|jpe?g|webp)$/i,
);

const normalizeFileName = (value = "") => {
  let normalizedValue = String(value)
    .trim()
    .replace(/\\/g, "/")
    .split("?")[0]
    .split("#")[0];

  try {
    normalizedValue = decodeURIComponent(normalizedValue);
  } catch (error) {
    console.warn("Không thể giải mã tên ảnh:", normalizedValue);
  }

  return normalizedValue.split("/").pop().trim().toLowerCase();
};

const resolveImportedImage = (importedImage) => {
  return importedImage?.default || importedImage || "";
};

/*
  Tạo map:

  cupcake_dau_hong.jpg
  -> URL ảnh do Webpack tạo
*/
const cakeImageMap = cakeImageContext.keys().reduce((result, contextKey) => {
  const fileName = normalizeFileName(contextKey.replace("./", ""));

  const importedImage = cakeImageContext(contextKey);

  result[fileName] = resolveImportedImage(importedImage);

  return result;
}, {});

export const getCakeImage = (imageValue) => {
  const fileName = normalizeFileName(imageValue);

  if (!fileName) {
    return "";
  }

  const image = cakeImageMap[fileName];

  if (!image) {
    console.warn(
      `Không tìm thấy ảnh "${fileName}" trong src/assets/images/cakes`,
    );

    return "";
  }

  return image;
};

export const getCakeImageFiles = () => {
  return Object.keys(cakeImageMap);
};

export const hasCakeImage = (imageValue) => {
  const fileName = normalizeFileName(imageValue);

  return Boolean(fileName && cakeImageMap[fileName]);
};
