export const CART_STORAGE_KEY = "petite-douceur-cart";

export const CART_UPDATED_EVENT = "petite-douceur-cart-updated";

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const readCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Không đọc được giỏ hàng:", error);

    return [];
  }
};

export const writeCart = (cartItems) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(safeCartItems));

  notifyCartUpdated();

  return safeCartItems;
};

export const addItemToCart = ({
  cake,
  selectedOption,
  quantity = 1,
  image = "",
}) => {
  const currentCart = readCart();

  const safeQuantity = Math.max(1, Number(quantity) || 1);

  const optionId = selectedOption?.id || "default";

  const itemKey = `${cake.id}-${optionId}`;

  const existingItem = currentCart.find((item) => item.itemKey === itemKey);

  let updatedCart;

  if (existingItem) {
    updatedCart = currentCart.map((item) => {
      if (item.itemKey !== itemKey) {
        return item;
      }

      return {
        ...item,

        quantity: Math.min(99, Number(item.quantity) + safeQuantity),
      };
    });
  } else {
    updatedCart = [
      ...currentCart,
      {
        itemKey,

        cakeId: cake.id,

        name: cake.name || "Bánh Petite Douceur",

        category: cake.category || "Bánh ngọt",

        image: image || cake.image || "",

        optionId,

        optionLabel: selectedOption?.label || "Mặc định",

        price: Number(selectedOption?.price ?? cake.price ?? 0) || 0,

        quantity: safeQuantity,
      },
    ];
  }

  return writeCart(updatedCart);
};

export const updateCartQuantity = (itemKey, quantity) => {
  const currentCart = readCart();

  const safeQuantity = Number(quantity);

  if (Number.isNaN(safeQuantity)) {
    return currentCart;
  }

  if (safeQuantity <= 0) {
    return removeCartItem(itemKey);
  }

  const updatedCart = currentCart.map((item) => {
    if (item.itemKey !== itemKey) {
      return item;
    }

    return {
      ...item,

      quantity: Math.min(99, Math.max(1, safeQuantity)),
    };
  });

  return writeCart(updatedCart);
};

export const removeCartItem = (itemKey) => {
  const currentCart = readCart();

  const updatedCart = currentCart.filter((item) => item.itemKey !== itemKey);

  return writeCart(updatedCart);
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);

  notifyCartUpdated();

  return [];
};

export const getCartSummary = (cartItems = []) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const shippingFee = subtotal === 0 || subtotal >= 300000 ? 0 : 30000;

  return {
    subtotal,
    shippingFee,

    total: subtotal + shippingFee,

    totalQuantity: cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ),
  };
};
