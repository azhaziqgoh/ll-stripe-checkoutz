import React from "react";
import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { IProductListsProps, IProductCardWrapper, IItem } from "../interface";

const ProductCardWrapper = styled.div`
  border: ${(props: IProductCardWrapper) =>
    props.selected ? "5px solid red" : "5px solid transparent"};
`;
const ProductCard = (props: IProductListsProps) => {
  const { item, onHandleProductSelection, selectedItems } = props;

  if (!item) {
    return null;
  }

  const generateValueStr = (value: number | null, currency: string) => {
    return typeof value === "number"
      ? `${currency.toUpperCase()} ${(value / 100).toFixed(2)}`
      : "N/A";
  };

  const checkSelected = (currentItem: IItem) => {
    return !!selectedItems.find(
      (it) => it.product.id === currentItem.product.id
    );
  };

  return (
    <ProductCardWrapper selected={checkSelected(item)}>
      <Card
        key={item.product.id}
        onClick={(evt) => onHandleProductSelection(item)}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={item.product.images[0]}
            alt={item.product.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {generateValueStr(item.price.unit_amount, item.price.currency)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </ProductCardWrapper>
  );
};

export default ProductCard;
