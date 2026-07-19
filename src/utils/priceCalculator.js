/*
Hàm tính giá bánh custom

Giá =
Size
+ Layer
+ Cream
+ Filling
+ Topping
*/
import {
  CAKE_SIZES,
  CAKE_LAYERS,
  CAKE_SPONGES,
  CAKE_FILLINGS,
  CAKE_CREAMS,
  CAKE_TOPPINGS
} from './constants';

export default function calculatePrice(selections) {
  if (!selections) return 0;

  let total = 0;

  const size = CAKE_SIZES.find((item) => item.id === selections.size);
  if (size) total += size.price;

  const layer = CAKE_LAYERS.find((item) => item.id === selections.layer);
  if (layer) total += layer.price;

  const sponge = CAKE_SPONGES.find((item) => item.id === selections.sponge);
  if (sponge) total += sponge.price;

  const filling = CAKE_FILLINGS.find((item) => item.id === selections.filling);
  if (filling) total += filling.price;

  const cream = CAKE_CREAMS.find((item) => item.id === selections.cream);
  if (cream) total += cream.price;

  if (selections.toppings && Array.isArray(selections.toppings)) {
    selections.toppings.forEach((toppingId) => {
      const topping = CAKE_TOPPINGS.find((item) => item.id === toppingId);
      if (topping) total += topping.price;
    });
  }

  return total;
}
