import React, { useEffect, useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutBtn from "../components/checkout_btn";
import ProductCard from "../components/product_card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stripe from "stripe";
import { IItem } from "../interface";
import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function PreviewPage() {
  const [items, setItems] = useState<IItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<IItem[]>([]);

  const onHandleProductSelection = (selectedItem: IItem) => {
    const foundItem = selectedItems.find(
      (it) => it.product.id === selectedItem.product.id
    );
    foundItem
      ? setSelectedItems(
          selectedItems.filter(
            (it) => it.product.id !== selectedItem.product.id
          )
        )
      : setSelectedItems([...selectedItems, selectedItem]);
  };

  const onHandleClick = async () => {

    try {
      const sessions = await axios({
        method: "POST",
        url: "/api/checkout_sessions",
        data: {
          checkout_session_data: selectedItems,
        },
      });

      const stripe = await stripePromise;

      if(stripe) {
        stripe.redirectToCheckout({
          sessionId: sessions.data.id,
        });
      } 
    } catch (e) {
      console.log(e);
    }
  }

  const generateListGrid = () => {
    const gridItems = items.map((item) => {
      return (
        <Grid key={item.product.id} item xs={12} sm={12} md={4}>
          <ProductCard
            item={item}
            selectedItems={selectedItems}
            onHandleProductSelection={onHandleProductSelection}
          />
        </Grid>
      );
    });

    return (
      <Grid container spacing={2}>
        {gridItems}
      </Grid>
    );
  };

  const setupProducts = useCallback(async () => {
    const values: Stripe.ApiList<Stripe.Price> = await axios("api/price_lists").then((res) => res.data);

    const prices: Stripe.Price[] = values.data;

    const remapItems: IItem[] = prices
      .filter((price) => price.active)
      .map((price) => {
        return {
          product: price.product,
          price,
        } as IItem;
      });

    setItems(remapItems);
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  useEffect(() => {
    setupProducts();
  }, [setupProducts]);

  return (
    <Container>
      <h1>Learning Loops: NextJS - Stripe Checkout with MUI</h1>
      {generateListGrid()}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CheckoutBtn selectedItems={selectedItems} onHandleClick={onHandleClick}/>
        </Grid>
      </Grid>


    </Container>
  );
}
