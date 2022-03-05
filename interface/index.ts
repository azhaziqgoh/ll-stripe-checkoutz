import Stripe from "stripe";

interface IItem {
  product: Stripe.Product;
  price: Stripe.Price;
}

interface IProductListsProps {
  item: IItem;
  selectedItems: IItem[];
  onHandleProductSelection: (product: IItem) => void;
}

interface IProductCardWrapper {
  selected: boolean;
}

interface ICheckoutBtnProps {
  selectedItems: IItem[];
  onHandleClick: () => void;
}

export type {
  IItem,
  IProductListsProps,
  IProductCardWrapper,
  ICheckoutBtnProps,
};
