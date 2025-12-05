import * as React from "react";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { QuotationResponse } from "./PaymentForm";
import { NumericFormat } from "react-number-format";
import { Inventory2Outlined } from "@mui/icons-material";

export interface OrderDetail {
  totalPrice: number;
  name?: string;
  lastName?: string;
  document?: number;
  email?: string;
  phone?: number;
  cellPhone?: number;
}
export interface ReviewDetail {
  name?: string;
  lastName?: string;
  document?: number;
  email?: string;
  phone?: number;
  cellPhone?: number;
  orderDetail: OrderDetail;
  data?: any;
  quotationResponse: QuotationResponse;
  ordenNumber: number;
}

interface ReviewDetailFormProps {
  reviewDetail: ReviewDetail;
  setReviewDetail: (reviewDetail: ReviewDetail) => void;
}

export default function Review({
  reviewDetail,
  setReviewDetail,
}: ReviewDetailFormProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" gutterBottom>
        Detalle de costo
      </Typography>

      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            primary="Bultos"
            secondary={reviewDetail.data.packages.length}
          />
          <Typography variant="body2">
            <NumericFormat
              displayType="text"
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              value={reviewDetail.quotationResponse.price}
              prefix={"$"}
            />
          </Typography>
        </ListItem>
        {reviewDetail.data.packages.map((box: any, index: number) => {
          return (
            <ListItem key={index}>
              <Inventory2Outlined />
              <ListItemText
                secondary={ box.pallet 
                  ? `Ancho: ${box.width} x Alto: ${box.height} x Largo: ${box.length} - ${box.weight} kg - (Pallet)`
                  : `Ancho: ${box.width} x Alto: ${box.height} x Largo: ${box.length} - ${box.weight} kg`
                }
              />
            </ListItem>
          );
        })}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Retiro a domicilio" secondary="Plus taxes" />
          <Typography variant="body2">
            <NumericFormat
              displayType="text"
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              value={reviewDetail.quotationResponse.withdrawalPrice}
              prefix={"$"}
            />
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Entrega en domicilio" secondary="Plus taxes" />
          <Typography variant="body2">
            <NumericFormat
              displayType="text"
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              value={reviewDetail.quotationResponse.deliveryPrice}
              prefix={"$"}
            />
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Seguro" secondary="1% del valor declarado" />
          <Typography variant="body2">
            ${reviewDetail.quotationResponse.insurance}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" secondary="No incluye IVA" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            <NumericFormat
              displayType="text"
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              value={reviewDetail.quotationResponse.total}
              prefix={"$"}
            />{" "}
            + IVA(21%)
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Detalle de envio
          </Typography>

          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Origen" secondary={reviewDetail.data.from} />
            <Typography color="text.secondary" gutterBottom>
              {reviewDetail.data.withdrawal ? (
                <LocalShippingIcon />
              ) : (
                <WarehouseIcon />
              )}
            </Typography>
          </ListItem>

          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Destino" secondary={reviewDetail.data.to} />
            <Typography color="text.secondary" gutterBottom>
              {reviewDetail.data.delivery ? (
                <LocalShippingIcon />
              ) : (
                <WarehouseIcon />
              )}
            </Typography>
          </ListItem>
        </div>
      </Stack>
    </Stack>
  );
}
