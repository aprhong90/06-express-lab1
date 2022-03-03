// require the express module
import express from "express";
import CartItem from "../models/CartItem";

// create a new Router object
const cartRouter = express.Router();

const cart: CartItem[] = [
  { id: 1, product: "vegan cheese", price: 9, quantity: 5 },
  { id: 2, product: "bread", price: 4, quantity: 2 },
  { id: 3, product: "onion", price: 1, quantity: 99 },
  { id: 4, product: "pasta", price: 5, quantity: 30 },
];
let nextId = 5;

cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let filteredArray: CartItem[] = cart;
  if (maxPrice) {
    filteredArray = filteredArray.filter(
      (item) => item.price <= parseInt(maxPrice as string)
    );
  }
  if (prefix) {
    filteredArray = filteredArray.filter((item) =>
      item.product.startsWith(prefix as string)
    );
  }
  if (pageSize) {
    filteredArray = filteredArray.slice(0, parseInt(pageSize as string));
  }
  res.status(200);
  res.json(filteredArray);
});

cartRouter.get("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  if (index === -1) {
    // why -1?
    res.status(404);
    res.send("ID not found");
  } else {
    res.status(200);
    res.json(cart[index]);
  }
});
//.send vs .sendStatus vs status?

cartRouter.post("/cart-items", (req, res) => {
  const newCartItem: CartItem = req.body; // what is this mean exactly?
  newCartItem.id = nextId++;
  cart.push(newCartItem);
  res.status(201);
  res.json(newCartItem);
});

cartRouter.put("/cart-items/:id", (req, res) => {
  const updatedItem: CartItem = req.body;
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  cart[index] = updatedItem; //updatedItem = cart[index] why not?...
  if (index === -1) {
    res.status(404);
    res.send("ID not found");
  } else {
    res.status(200);
    res.json(cart[index]);
  }
});

cartRouter.delete("/cart-items/:id", (req, res) => {
  const id: number = parseInt(req.params.id);
  const index: number = cart.findIndex((item) => item.id === id);
  cart.splice(index, 1);
  res.sendStatus(204);
});
//status -> keeps sending request. why??
//.send vs .sendStatus vs status or even .json

export default cartRouter;
