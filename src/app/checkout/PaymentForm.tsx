"use client";
import * as React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Image from "next/image";
import CalculateIcon from "@mui/icons-material/Calculate";
import LoadingButton from "@mui/lab/LoadingButton";

import { display, styled } from "@mui/system";

import FormHelperText from "@mui/material/FormHelperText";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Zoom,
} from "@mui/material";
import { Add, DeleteForever, Inventory } from "@mui/icons-material";
import { AxiosAdapter } from "@/lib/adapter/axios.adapter";
import ZipCodes from "@/app/models/ZipCodes";
import "./index.css";
import ZipCode from "@/app/models/ZipCodes";

const http = new AxiosAdapter();

const FormGrid = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

const images = [
  {
    label: "Caja",
    imgPath: "/box.png",
  },
  {
    label: "Pallet",
    imgPath: "/pallet.png",
  },
];

export interface QuotationResponse {
  price: number;
  withdrawalPrice: number;
  deliveryPrice: number;
  insurance: number;
  total: number;
}

interface Box {
  price: number | undefined;
  weight: number | undefined;
  length: number | undefined;
  height: number | undefined;
  width: number | undefined;
  pallet: boolean | undefined;
}

interface Route {
  from: string;
  to: string;
}

interface BoxError {
  boxIndex: number;
  price?: string | undefined;
  weight?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
  length?: string | undefined;
}

interface IProps {
  onCalculate: (priceResponse: QuotationResponse, data: any) => void;
  handleFormIsValid: (isValid: boolean) => void;
  paymentDetails: any;
  setPaymentDetails: any;
  value: any;
  setValue: any;
  valueDestination: any;
  setValueDestination: any;
}

export default function PaymentForm({
  onCalculate,
  handleFormIsValid,
  paymentDetails,
  setPaymentDetails,
  value,
  setValue,
  valueDestination,
  setValueDestination,
}: IProps) {
  const emptyBox: Box = {
    price: undefined,
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    pallet: false,
  };
  const [searchResults, setSearchResults] = useState<ZipCodes[]>([]);
  const [searchResultsDestination, setSearchResultsDestination] = useState<
    ZipCodes[]
  >([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDestinationCities, setLoadingDestinationCities] =
    useState(false);
  const [destinationValue, setDestinationValue] = useState<string | undefined>(
    undefined
  );
  const [originValue, setOriginValue] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>(paymentDetails.packages);
  const [isAddressOrigin, setIsAddressOrigin] = useState<boolean>(paymentDetails.withdrawal)
  const [isAddressDestination, setIsAddressDestination] = useState<boolean>(paymentDetails.delivery)
  const [isPallet, setIsPallet] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [boxErrors, setBoxErrors] = useState<BoxError[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    validateInitialBoxes();
  }, [boxes])

  useEffect(() => {
    handleFormIsValid(isFormValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormValid, paymentDetails]);

  const checkIsFormValid = (box: Box, index: number, key: string) => {
    const priceIsValid: boolean = !!box.price && box?.price > 0;
    const weightIsValid: boolean = !!box.weight && box?.weight > 0;
    const widthIsValid: boolean = !!box.width && box?.width > 0;
    const heightIsValid: boolean = !!box.height && box?.height > 0;
    const length: boolean = !!box.length && box?.length > 0;

    !priceIsValid
      ? handleBoxError("price", index, true)
      : handleBoxError("price", index, false);
    !weightIsValid
      ? handleBoxError("weight", index, true)
      : handleBoxError("weight", index, false);
    !widthIsValid
      ? handleBoxError("height", index, true)
      : handleBoxError("height", index, false);
    !heightIsValid
      ? handleBoxError("width", index, true)
      : handleBoxError("width", index, false);
    !length
      ? handleBoxError("length", index, true)
      : handleBoxError("length", index, false);

    setIsFormValid(
      priceIsValid && weightIsValid && widthIsValid && heightIsValid && length
    );
  };

  const validateInitialBoxes = () => {
    let allBoxesValid = true;

    boxes.forEach((box, index) => {
      const priceIsValid = !!box.price && box.price > 0;
      const weightIsValid = !!box.weight && box.weight > 0;
      const widthIsValid = !!box.width && box.width > 0;
      const heightIsValid = !!box.height && box.height > 0;
      const lengthIsValid = !!box.length && box.length > 0;

      !priceIsValid ? handleBoxError("price", index, true) : handleBoxError("price", index, false);
      !weightIsValid ? handleBoxError("weight", index, true) : handleBoxError("weight", index, false);
      !widthIsValid ? handleBoxError("height", index, true) : handleBoxError("height", index, false);
      !heightIsValid ? handleBoxError("width", index, true) : handleBoxError("width", index, false);
      !lengthIsValid ? handleBoxError("length", index, true) : handleBoxError("length", index, false);

      if (!(priceIsValid && weightIsValid && widthIsValid && heightIsValid && lengthIsValid)) {
        allBoxesValid = false;
      }
    });

    setIsFormValid(allBoxesValid);
    handleFormIsValid(allBoxesValid);
  };

  const handleClickAddBoxButton = () => {
    setBoxes([...boxes, emptyBox]);
    setIsFormValid(false);
  };

  const handleRemoveBox = (index: number) => {
    const boxesFiltered = boxes.filter((box, boxIndex) => boxIndex !== index);
    setBoxes(boxesFiltered);
  };

  const handleBoxError = (
    fieldKey: string,
    index: number,
    isError: boolean
  ) => {
    const prevBoxErrors: BoxError | undefined = boxErrors.find(
      (error) => error.boxIndex === index
    );
    const boxErrorsFiltered = boxErrors.filter(
      (error) => error.boxIndex !== index
    );

    const newError: BoxError = {
      ...prevBoxErrors,
      boxIndex: index,
      [fieldKey]: isError ? `${fieldKey} no es valido` : undefined,
    };

    setBoxErrors([...boxErrorsFiltered, newError]);
  };

  const handleInputChange = (event: any, index: number) => {
    const box: Box | undefined = boxes.find((_, boxIndex) => {
      return boxIndex === index;
    });

    if (box) {
      const key: any = event.target.id;
      box[key as keyof Box] = event.target.value;

      boxes[index] = box;
      setBoxes([...boxes]);
      box && checkIsFormValid(box, index, key);
    }
  };

  useEffect(() => {}, [originValue, destinationValue]);

  const handleOriginValueChange = (event: any) => {
    event.target.innerText && setOriginValue(event.target.innerText);
  };

  const handleOriginInputChange = async (event: any) => {
    setLoadingCities(true);

    if (event.target.value.length < 4) {
      setSearchResults([]);
    }

    try {
      const resp: ZipCodes[] = await http.get(
        `/api/rest/location/${event.target.value}`
      );
      setSearchResults(resp);
      setLoadingCities(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setLoadingCities(false);
    }
  };

  const handleAddressOriginChange = (event: any) => {
    // setOriginValue(undefined);
    setIsAddressOrigin(event.target.checked);
  };

  const handleDestinationValueChange = (event: any) => {
    event.target.innerText && setDestinationValue(event.target.innerText);
  };

  const handleDestinationInputChange = async (event: any) => {
    setLoadingDestinationCities(true);

    if (event.target.value.length < 4) {
      setSearchResultsDestination([]);
    }

    try {
      const resp: ZipCodes[] = await http.get(
        `/api/rest/location/${event.target.value}`
      );
      setSearchResultsDestination(resp);
      setLoadingDestinationCities(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResultsDestination([]);
      setLoadingDestinationCities(false);
    }
  };

  const handleQuotation = async (event: any) => {
    setLoading(true);

    const requestBody = {
      from: paymentDetails.from,
      to: paymentDetails.to,
      packages: boxes.map((box) => ({
        price: box.price,
        length: box.length,
        width: box.width,
        height: box.height,
        weight: box.weight,
        pallet: box.pallet,
      })),
      loadValue: boxes.reduce((total, box) => total + Number(box.price), 0),
      delivery: isAddressDestination ? isAddressDestination : false,
      withdrawal: isAddressOrigin ? isAddressOrigin : false,
    };

    try {
      const resp: QuotationResponse = await http.post(
        "/api/rest/quotation",
        requestBody
      );
      onCalculate(resp, requestBody);

      setPaymentDetails(requestBody);
      setLoading(false);
      setTotal(Number((+resp.total).toFixed(2)));
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  const handleIsPalletChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newBoxes = [...boxes];
      newBoxes[index] = {
        ...newBoxes[index],
        pallet: event.target.checked,
      };
      setBoxes(newBoxes);
    };

  const handleAddressDestinationChange = (event: any) => {
    setIsAddressDestination(event.target.checked);
  };

  const needsShowBoxError = (index: number) => {
    return !!boxErrors.find((err) => err.boxIndex === index);
  };

  const getBoxError = (index: number, fieldKey: string) => {
    const boxError: BoxError | undefined = boxErrors.find(
      (err) => err.boxIndex === index
    );
    return boxError ? boxError[fieldKey as keyof BoxError] : undefined;
  };

  return (
    <Stack spacing={{ xs: 3, sm: 1 }} useFlexGap>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle2">
          <LocalShippingIcon
            sx={{ color: "text.secondary", verticalAlign: "middle" }}
          />{" "}
          Datos del envío
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: 2,
          mt: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormLabel htmlFor="width">Con retiro a domicilio</FormLabel>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>No</Typography>
              <Switch
                defaultChecked={isAddressOrigin}
                onChange={handleAddressOriginChange}
                checked={isAddressOrigin}
              />
              <Typography>Si</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <FormLabel htmlFor="width">Origen</FormLabel>
            <Autocomplete
              id="asynchronous-demo"
              value={value}
              onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
              }}
              inputValue={paymentDetails.from}
              onInputChange={(event, newInputValue) => {
                setPaymentDetails((prevDetails:any) => ({
                  ...prevDetails,
                  from: newInputValue,
                }));
              }}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.city === value.city
              }
              getOptionLabel={(option) => {
                return option.city ? `${option.city} - ${option.state}` : "";
              }}
              options={searchResults}
              loading={loadingCities}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.defaultMuiPrevented = true;
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={handleOriginInputChange}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <div style={{ display: "flex" }}>
                        {loadingCities ? (
                          <CircularProgress
                            color="inherit"
                            size={20}
                            sx={{ mr: 5 }}
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </div>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: 2,
          mt: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormLabel htmlFor="width">Con entrega a domicilio</FormLabel>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>No</Typography>
              <Switch
                defaultChecked={isAddressDestination}
                onChange={handleAddressDestinationChange}
                checked={isAddressDestination}
              />
              <Typography>Si</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <FormLabel htmlFor="asynchronous-destination">Destino</FormLabel>
            <Autocomplete
              id="asynchronous-destination"
              value={valueDestination}
              onChange={(event: any, newValue: string | null) => {
                setValueDestination(newValue);
              }}
              inputValue={paymentDetails.to}
              onInputChange={(event, newInputValue) => {
                setPaymentDetails((prevDetails:any) => ({
                  ...prevDetails,
                  to: newInputValue,
                }));
              }}
              open={openDestination}
              onOpen={() => {
                setOpenDestination(true);
              }}
              onClose={() => {
                setOpenDestination(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.city === value.city
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.defaultMuiPrevented = true;
                }
              }}
              getOptionLabel={(option) => `${option.city} - ${option.state}`}
              options={searchResultsDestination}
              loading={loadingDestinationCities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={handleDestinationInputChange}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingDestinationCities ? (
                          <CircularProgress
                            sx={{ mr: 5 }}
                            color="inherit"
                            size={20}
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <br />
      <Divider />
      {boxes.map((box, index) => {
        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Zoom in={true}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 3,
                  height: { xs: 350, sm: 370, md: 375 },
                  width: "100%",
                  borderRadius: "20px",
                  border: "1px solid ",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2">
                    <Inventory
                      sx={{ color: "text.secondary", verticalAlign: "middle" }}
                    />{" "}
                    Bulto ({index + 1})
                  </Typography>
                  <IconButton onClick={() => handleRemoveBox(index)}>
                    <DeleteForever />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    justifyContent: "space-around",
                    justifyItems: "center",
                    display: "flex",
                  }}
                >
                  <Image src="/box.png" alt="Box" width={60} height={60} />
                  <Image src="/boxes.png" alt="Box" width={90} height={90} />
                  <Image src="/pallet.png" alt="Box" width={90} height={90} />
                </Box>
                <Grid container>
                  <Grid xs={12} item>
                    <Box sx={{ display: "flex", p: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormGrid>
                            <FormLabel htmlFor="price" required>
                              Valor de la mercancía
                            </FormLabel>
                            <OutlinedInput
                              id="price"
                              name="price"
                              type="number"
                              autoComplete="off"
                              placeholder="Valor declarado total"
                              required
                              fullWidth
                              value={box.price}
                              onChange={(ev) => handleInputChange(ev, index)}
                            />
                            {needsShowBoxError(index) && (
                              <FormHelperText error>
                                {getBoxError(index, "price")}
                              </FormHelperText>
                            )}
                          </FormGrid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormGrid sx={{ ml: 1 }}>
                            <FormLabel htmlFor="pallet">
                              Es un Pallet?
                            </FormLabel>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography>No</Typography>
                              <Switch
                                onChange={handleIsPalletChange(index)}
                                checked={box.pallet}
                              />
                              <Typography>Si</Typography>
                            </Stack>
                          </FormGrid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid xs={12} item>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 2,
                        p: 1,
                      }}
                    >
                      <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="weight" required>
                          Peso
                        </FormLabel>
                        <OutlinedInput
                          id="weight"
                          name="weight"
                          type="number"
                          autoComplete="off"
                          placeholder="peso (kg)"
                          inputProps={{ min: "0", pattern: "^[0-9]+" }}
                          required
                          value={box.weight}
                          onChange={(ev: any) => handleInputChange(ev, index)}
                          endAdornment={
                            <InputAdornment position="end">kg</InputAdornment>
                          }
                        />
                        {needsShowBoxError(index) && (
                          <FormHelperText error>
                            {getBoxError(index, "weight")}
                          </FormHelperText>
                        )}
                      </FormGrid>
                      <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="width" required>
                          Ancho
                        </FormLabel>
                        <OutlinedInput
                          id="width"
                          name="width"
                          type="number"
                          autoComplete="off"
                          placeholder="ancho (cm)"
                          required
                          value={box.width}
                          onChange={(ev: any) => handleInputChange(ev, index)}
                          endAdornment={
                            <InputAdornment position="end">cm</InputAdornment>
                          }
                        />
                        {needsShowBoxError(index) && (
                          <FormHelperText error>
                            {getBoxError(index, "width")}
                          </FormHelperText>
                        )}
                      </FormGrid>
                    </Box>
                  </Grid>
                  <Grid xs={12} item>
                    <Box sx={{ display: "flex", gap: 2, p: 1 }}>
                      <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="height" required>
                          Alto
                        </FormLabel>
                        <OutlinedInput
                          id="height"
                          name="height"
                          type="number"
                          autoComplete="off"
                          placeholder="alto (cm)"
                          required
                          value={box.height}
                          onChange={(ev: any) => handleInputChange(ev, index)}
                          endAdornment={
                            <InputAdornment position="end">cm</InputAdornment>
                          }
                        />
                        {needsShowBoxError(index) && (
                          <FormHelperText error>
                            {getBoxError(index, "height")}
                          </FormHelperText>
                        )}
                      </FormGrid>
                      <FormGrid sx={{ flexGrow: 1 }}>
                        <FormLabel htmlFor="length" required>
                          Largo
                        </FormLabel>
                        <OutlinedInput
                          id="length"
                          name="length"
                          type="number"
                          autoComplete="off"
                          placeholder="largo (cm)"
                          required
                          value={box.length}
                          onChange={(ev: any) => handleInputChange(ev, index)}
                          endAdornment={
                            <InputAdornment position="end">cm</InputAdornment>
                          }
                        />
                        {needsShowBoxError(index) && (
                          <FormHelperText error>
                            {getBoxError(index, "Largo")}
                          </FormHelperText>
                        )}
                      </FormGrid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Zoom>
          </Box>
        );
      })}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Button endIcon={<Add />} onClick={handleClickAddBoxButton}>
          Agregar bulto
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LoadingButton
              onClick={handleQuotation}
              loadingIndicator={
                <span
                  style={{
                    display: "inline-block",
                    animation: "moveCar 2s infinite linear",
                  }}
                >
                  <LocalShippingIcon sx={{ color: "#0959aa" }} />
                </span>
              }
              loading={loading}
              loadingPosition="center"
              variant="outlined"
              sx={{
                "@keyframes moveCar": {
                  "0%": { transform: "translateX(-150%) scaleX(1)" },
                  "25%": { transform: "translateX(0) scaleX(1)" },
                  "50%": { transform: "translateX(150%) scaleX(1)" },
                  "51%": { transform: "translateX(150%) scaleX(-1)" },
                  "75%": { transform: "translateX(0) scaleX(-1)" },
                  "100%": { transform: "translateX(-150%) scaleX(-1)" },
                },
                width: "119px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "margin-right 0.5s",
              }}
            >
              <span>Calcular</span>
              <CalculateIcon sx={{ marginLeft: 1 }} />
            </LoadingButton>
          </Box>
          {total !== null && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "green",
                  transition: "opacity 0.5s, margin-left 0.5s",
                  opacity: total !== null ? 1 : 0,
                  fontSize: "1.2rem",
                }}
              >
                ${total}
              </Typography>
            </Box>
          )}
        </Box>
      </div>

      <Divider />
    </Stack>
  );
}
