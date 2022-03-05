import React from "react";
import Button from "@mui/material/Button";
import { ICheckoutBtnProps } from "../interface";

const CheckoutBtn = (props: ICheckoutBtnProps) => {
  const { selectedItems, onHandleClick } = props;

  return (
    <Button
      variant="contained"
      style={{ width: "100%" }}
      onClick={onHandleClick}
      disabled={selectedItems.length === 0}
    >
      Proceed to checkout
    </Button>
  );
};

export default CheckoutBtn;
