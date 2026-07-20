/*
Hàm tính giá bánh custom

*/
export const calculatePrice = ({
  size = 0,
  layer = 0,
  base = 0,
  filling = 0,
  cream = 0,
  toppings = [],
}) => {
  const toppingPrice = toppings.reduce((total, item) => total + item.price, 0);

  return size + layer + base + filling + cream + toppingPrice;
};
