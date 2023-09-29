// cartUtils.js

export function addToCart(cartItems, product) {
  const existingProductIndex = cartItems.findIndex(
    item => item.sysid === product.sysid,
  );

  if (existingProductIndex !== -1) {
    const updatedCartItems = [...cartItems];
    updatedCartItems[existingProductIndex].quantity += 1;
    return updatedCartItems;
  } else {
    return [...cartItems, {...product, quantity: 1}];
  }
}
