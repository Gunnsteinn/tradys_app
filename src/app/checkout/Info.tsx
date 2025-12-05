import * as React from "react";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { ListItem, ListItemText } from "@mui/material";
import { NumericFormat } from "react-number-format";

export interface OrderDetail {
  totalPrice: number;
  name?: string;
  lastName?: string;
  document?: number;
  email?: string;
  phone?: number;
  cellPhone?: number;
}

interface InfoProps {
  orderDetail: OrderDetail;
}

export default function Info({ orderDetail }: InfoProps) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderDetail.totalPrice]);

  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Total
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        className={isAnimating ? "highlight" : ""}
        sx={{
          "@keyframes highlight": {
            "0%": { backgroundColor: "#82E0AA", opacity: 0.5 },
            "100%": { backgroundColor: "transparent", opacity: 1 },
          },
          "&.highlight": {
            animation: "highlight 1s ease-in-out",
          },
        }}
      >
        <NumericFormat
          displayType="text"
          decimalScale={2}
          decimalSeparator=","
          thousandSeparator="."
          value={orderDetail.totalPrice}
          prefix={"$"}
        />
      </Typography>
      <List disablePadding>
        <ListItem key={"name"} sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Nombre"} />
          <Typography variant="body1" fontWeight="medium">
            {orderDetail.name}
          </Typography>
        </ListItem>
        <ListItem key={"lastName"} sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Apellido"} />
          <Typography variant="body1" fontWeight="medium">
            {orderDetail.lastName}
          </Typography>
        </ListItem>
        <ListItem key={"email"} sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Email"} />
          <Typography variant="body1" fontWeight="medium">
            {orderDetail.email}
          </Typography>
        </ListItem>
        <ListItem key={"cellPhone"} sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Celular"} />
          <Typography variant="body1" fontWeight="medium">
            {orderDetail.cellPhone}
          </Typography>
        </ListItem>
        <ListItem key={"phone"} sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"Telefono Fijo"} />
          <Typography variant="body1" fontWeight="medium">
            {orderDetail.phone}
          </Typography>
        </ListItem>
        <ListItem key={"document"} sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={"DNI/CUIT"} />
          <Typography variant="body1" fontWeight="medium">
            {orderDetail.document}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}
