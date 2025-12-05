"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import { OrderDetail } from "./Info";
import FormHelperText from "@mui/material/FormHelperText";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface AddressFormProps {
  orderDetail: OrderDetail;
  setOrderDetail: (orderDetail: OrderDetail) => void;
  handleFormIsValid: (isValid: boolean) => void;
}

export default function AddressForm({
  orderDetail,
  setOrderDetail,
  handleFormIsValid,
}: AddressFormProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [cellPhoneError, setCellPhoneError] = useState("");
  const [documentError, setDocumentError] = useState("");

  useEffect(() => {
    handleFormIsValid(isFormValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormValid]);

  useEffect(() => {
    checkIsFormValid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail]);

  useEffect(() => {
    const intervalId = setInterval(()=>{}, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e: any) => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    setOrderDetail({
      ...orderDetail,
      [fieldName]: fieldValue,
    });
    changeOrderDetails(e);
  };

  const checkIsFormValid = () => {
    setIsFormValid(
      !!orderDetail.name &&
        !!orderDetail.lastName &&
        !!orderDetail.email &&
        !!orderDetail.cellPhone &&
        !!orderDetail.document &&
        isValidEmail(orderDetail.email) &&
        !nameError &&
        !lastNameError &&
        !cellPhoneError
    );
  };

  const changeOrderDetails = (ev: React.FocusEvent<HTMLInputElement>) => {
    const fieldName: string = ev.target.name;
    const fieldValue: string = ev.target.value;

    let error = "";
    switch (fieldName) {
      case "email":
        error = isValidEmail(fieldValue) ? "" : "Email inválido.";
        setEmailError(error);
        break;
      case "name":
        error =
          fieldValue.length < 3
            ? "Nombre debe contener mas de 3 caracteres"
            : "";
        setNameError(error);
        break;
      case "lastName":
        error =
          fieldValue.length < 3
            ? "Apellido debe contener mas de 3 caracteres"
            : "";
        setLastNameError(error);
        break;
      case "cellPhone":
        error = fieldValue.length != 10 ? "Número de celular inválido." : "";
        setCellPhoneError(error);
        break;
      case "document":
        const documenteRegex = /^\d{8,11}$/;
        error = !documenteRegex.test(fieldValue) ? "DNI/CUIT inválido." : "";
        setDocumentError(error);
        break;
      default:
        break;
    }

    setOrderDetail({
      ...orderDetail,
      [fieldName]: fieldValue,
    });
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <Grid container spacing={5}>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          Nombre
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="name"
          type="name"
          value={orderDetail.name}
          placeholder="Nombre"
          autoComplete="given-name"
          onChange={handleInputChange}
          onBlur={handleInputChange}
          required
        />
        {nameError && <FormHelperText error>{nameError}</FormHelperText>}
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Apellido
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="lastName"
          type="last-name"
          value={orderDetail.lastName}
          placeholder="Apellido"
          autoComplete="family-name"          
          onChange={handleInputChange}
          onBlur={handleInputChange}
          required
        />
        {lastNameError && (
          <FormHelperText error>{lastNameError}</FormHelperText>
        )}
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="email" required>
          Email
        </FormLabel>
        <OutlinedInput
          id="email"
          name="email"
          type="email"
          value={orderDetail.email}
          placeholder="Ingresá tu email"
          autoComplete="email"  
          onChange={handleInputChange}
          onBlur={handleInputChange}
          error={Boolean(emailError)}
          required
        />
        {emailError && <FormHelperText error>{emailError}</FormHelperText>}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="cellPhone">Número de Celular *</FormLabel>
        <OutlinedInput
          id="cellPhone"
          name="cellPhone"
          type="number"
          value={orderDetail.cellPhone}
          placeholder="ej: 3519999999"
          autoComplete="Número de Celular"          
          onChange={handleInputChange}
          onBlur={handleInputChange}
          required
        />
        {cellPhoneError && (
          <FormHelperText error>{cellPhoneError}</FormHelperText>
        )}
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="Phone">Número de teléfono</FormLabel>
        <OutlinedInput
          id="phone"
          name="phone"
          type="number"
          value={orderDetail.phone}
          placeholder="Ingresá tu numero de teléfono fijo"
          autoComplete="Número de teléfono"          
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="document" required>
          DNI/CUIT
        </FormLabel>
        <OutlinedInput
          id="document"
          name="document"
          type="number"
          value={orderDetail.document}
          placeholder="Ingresá tu DNI o CUIT"
          autoComplete="citizen-id"          
          onChange={handleInputChange}
          onBlur={handleInputChange}
          required
        />
        {documentError && (
          <FormHelperText error>{documentError}</FormHelperText>
        )}
      </FormGrid>
    </Grid>
  );
}
