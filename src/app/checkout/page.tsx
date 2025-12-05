"use client";
import * as React from "react";
import { useState } from "react";

import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Grid } from "@mui/material";
import { Stack } from "@mui/material";
import { Step } from "@mui/material";
import { StepLabel } from "@mui/material";
import { Stepper } from "@mui/material";
import { ToggleButton } from "@mui/material";
import { ToggleButtonGroup } from "@mui/material";
import { Typography } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AddressForm from "./AddressForm";
import PaymentForm, { QuotationResponse } from "./PaymentForm";
import Review, { ReviewDetail } from "./Review";
import getCheckoutTheme from "./getCheckoutTheme";
import Info, { OrderDetail } from "./Info";
import ToggleColorMode from "./ToggleColorMode";
import InfoMobile from "./InfoMobile";
import "./font/font.css";
import Image from "next/image";
import { AxiosAdapter } from "@/lib/adapter/axios.adapter";

const http = new AxiosAdapter();

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

const fixedContentStyles = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "calc(100vw - 520px)", // Adjust width as needed
  height: "100vh", // Adjust height as needed
  overflowY: "auto",
  padding: "24px",
};

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100dvw",
        position: "fixed",
        bottom: 24,
        fontFamily: "Inter",
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: "background.default",
          "& .Mui-selected": {
            pointerEvents: "none",
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: "20px", mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

const steps = ["Datos personales", "Datos de envío", "Resumen"];

const logoStyle = {
  width: "140px",
  height: "auto",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function Checkout() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = React.useState(0);
  const [randomOrderNumber, setRandomOrderNumber] = React.useState(
    Math.floor(Math.random() * 1000000)
  );
  const order: OrderDetail = {
    totalPrice: 0,
    name: "",
    lastName: "",
    document: undefined,
    email: "",
    phone: undefined,
    cellPhone: undefined,
  };

  const emptyBox: any = {
    price: undefined,
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    pallet: false,
  };

  const payment: any = {
    delivery: undefined,
    from: "",
    loadValue: 0,
    packages: [emptyBox],
    to: "",
    withdrawal: undefined,
  };

  const review: ReviewDetail = {
    orderDetail: order,
    data: "",
    quotationResponse: {
      price: 0,
      withdrawalPrice: 0,
      deliveryPrice: 0,
      insurance: 0,
      total: 0,
    },
    ordenNumber: 0,
  };

  const [orderDetail, setOrderDetail] = useState(order);
  const [paymentDetails, setPaymentDetails] = useState(payment);
  const [reviewDetail, setReviewDetail] = useState(review);
  const [nextButtonIsDisabled, setNextButtonIsDisabled] = useState(false);
  const [value, setValue] = React.useState<string | null>(null);
  const [valueDestination, setValueDestination] = React.useState<string | null>(null);

  const handleAddressFormIsValid = (isValid: boolean) => {
    setNextButtonIsDisabled(!isValid);
  };

  function getStepContent(
    step: number,
    orderDetail: OrderDetail,
    reviewDetail: ReviewDetail,
    setOrderDetail: (orderDetail: OrderDetail) => void,
    setReviewDetail: (reviewDetail: ReviewDetail) => void,
    onCalculate: (priceResponse: QuotationResponse, data: any) => void
  ) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            orderDetail={orderDetail}
            setOrderDetail={setOrderDetail}
            handleFormIsValid={handleAddressFormIsValid}
          />
        );
      case 1:
        return (
          <PaymentForm
            onCalculate={onCalculate}
            handleFormIsValid={handleAddressFormIsValid}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            value={value}
            setValue={setValue}
            valueDestination={valueDestination}
            setValueDestination={setValueDestination}
          />
        );
      case 2:
        return (
          <Review
            reviewDetail={reviewDetail}
            setReviewDetail={setReviewDetail}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  function getRandomNumber() {
    return randomOrderNumber;
  }

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleNext = async () => {
    if (activeStep + 1 == 3) {
      await http.post("/api/rest/user_details", reviewDetail);
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const onCalculate = (quotationResponse: QuotationResponse, data: any) => {
    setOrderDetail({
      ...orderDetail,
      totalPrice: parseFloat(quotationResponse.total.toFixed(2)),
    });

    setReviewDetail({
      ...reviewDetail,
      orderDetail: orderDetail,
      data: data,
      quotationResponse: quotationResponse,
      ordenNumber: randomOrderNumber,
    });
  };

  const handleRestart = () => {
    setRandomOrderNumber(Math.floor(Math.random() * 1000000));
    setActiveStep(0);
    setNextButtonIsDisabled(true);
    setOrderDetail({
      ...order,
      totalPrice: 0,
    });
    setReviewDetail({
      ...reviewDetail,
    });
    setPaymentDetails({
      delivery: undefined,
      from: "",
      loadValue: 0,
      packages: [emptyBox],
      to: "",
      withdrawal: undefined,
    })
    setValue(null)
    setValueDestination(null)
  };

  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
      <CssBaseline />
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            position: "sticky",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              position: "sticky",
              flexDirection: "column",
              top: 30,
              minWidth: 300,
              left: 50,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                height: 150,
              }}
            >
              <Box>
                <Button
                  startIcon={<ArrowBackRoundedIcon />}
                  component="a"
                  href="https://www.tradysargentina.com.ar"
                  sx={{ ml: "-8px", py: 3 }}
                >
                  <img src="/logo.png" alt="Tradys logo" style={logoStyle} />
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  pb: "6px",
                }}
              >
                <ToggleColorMode
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
              </Box>
            </Box>
            <br />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                maxWidth: 500,
              }}
            >
              <Info orderDetail={orderDetail} />
            </Box>
            <Box
              sx={{
                position: "fixed",
                left: "90vw",
                bottom: "4.6vh",
                zIndex: 999,
              }}
            >
              <a
                aria-label="WhatsApp"
                href="https://wa.me/5493512277985"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  alt="WhatsApp"
                  src="/whatsapp.png"
                  width={90}
                  height={90}
                />
              </a>
            </Box>
          </div>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 4 },
            overflowY: "scroll",
            scrollBehavior: "smooth",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                component="a"
                href="https://www.tradysargentina.com.ar"
                sx={{ alignSelf: "start" }}
              >
                <img src="/logo.png" alt="Tradys logo" style={logoStyle} />
              </Button>
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
                height: 80,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: "100%",
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-of-type": { pl: 0 },
                      ":last-of-type": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                ":last-child": { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Total
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 1 ? orderDetail.totalPrice : 0}
                </Typography>
              </div>
              <InfoMobile orderDetail={orderDetail} />
              <Box
                sx={{
                  position: "fixed",
                  left: "79vw",
                  bottom: "19.9vh",
                  zIndex: 999,
                }}
              >
                <a
                  aria-label="WhatsApp"
                  href="https://wa.me/5493513051073"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    alt="WhatsApp"
                    src="/whatsapp.png"
                    width={90}
                    height={90}
                  />
                </a>
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-of-type": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">
                  Gracias por usar nuestro Cotizador!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Su numero de solicitud es
                  <strong>&nbsp;#{getRandomNumber()}</strong>. Se ha enviado un
                  correo electrónico a nuestros agentes de venta, a la brevedad
                  se contactaran con ustedes para asistirlo con sus inquietudes.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleRestart}
                  sx={{
                    alignSelf: "start",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Volver a Cotizar
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(
                  activeStep,
                  orderDetail,
                  reviewDetail,
                  setOrderDetail,
                  setReviewDetail,
                  onCalculate
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 2, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                    position: "relative",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      Volver
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      Volver
                    </Button>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignContent: "end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      disabled={nextButtonIsDisabled}
                      sx={{
                        width: { xs: "100%", sm: "fit-content" },
                      }}
                    >
                      Siguiente
                    </Button>
                  </Box>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
