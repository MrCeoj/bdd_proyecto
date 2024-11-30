"use client";
import { Input, Button } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Modal, Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, SelectChangeEvent } from "@mui/material";
import useFiltersStore from "@/app/hooks/zustand";

const SearchBar = () => {
  const { 
    dias, 
    sucursales, 
    costos, 
    search,
    setSearch,
    setRows,
  } = useFiltersStore();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre: "",
    sucursal: "",
    costo: "",
    cupoMax: "",
    weekdays: {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
    },
  });

  const handleSearch = async () => {
    console.log("Buscando...");
    const queryParams = new URLSearchParams({
      search: search,
      dias: JSON.stringify(dias),
      sucursales: JSON.stringify(sucursales),
      costos: JSON.stringify(costos),
    });
  
    try {
      const response = await fetch(`/api/filters?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
  
      const data = await response.json();
      console.log(data);
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormValues({
      ...formValues,
      sucursal: event.target.value as string,
    });
  };

  const handleWeekdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      weekdays: {
        ...formValues.weekdays,
        [event.target.name]: event.target.checked,
      },
    });
  };

  const handleSubmit = () => {
    // Enviar los datos al servidor
    console.log(formValues);

    // fetch POST
    fetch("/api/clases", {
      method: "POST",
      body: JSON.stringify(formValues),
    });
    handleClose();
  };

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-3/5 border-solid border-b-2 border-b-text flex flex-row justify-between">
        <Input
          variant="underlined"
          value={search}
          onValueChange={(value) => setSearch(value)}
          placeholder="Buscar una clase..."
          className="mt-12"
          classNames={{
            input: [
              "text-text",
              "text-2xl",
              "font-inria",
              "bg-transparent",
              "py-2",
              "w-full",
            ],
            mainWrapper: ["w-full"],
          }}
        />
        <Button
          className="bg-text text-back mt-12 w-12 font-inria flex justify-center items-center"
          onPress={handleSearch}
        >
          <MagnifyingGlassIcon className="h-12 w-12 text-back" />
        </Button>
      </div>
      <Button
        className="bg-accent text-back flex flex-row text-2xl mt-12 justify-evenly px-4 rounded-lg font-bold mr-24"
        onPress={handleOpen}
      >
        <PlusCircleIcon className="h-8 w-8 text-back" />
        Agregar clase
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Agregar Clase
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la clase"
            type="text"
            fullWidth
            variant="outlined"
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Costo"
            type="number"
            fullWidth
            variant="outlined"
            inputProps={{ min: 200, max: 1200 }}
            name="costo"
            value={formValues.costo}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Sucursal</InputLabel>
            <Select
              value={formValues.sucursal}
              onChange={handleSelectChange}
              label="Sucursal"
            >
              <MenuItem value="Villafontana">Villafontana</MenuItem>
              <MenuItem value="Las Fuentes">Las Fuentes</MenuItem>
              <MenuItem value="Garibaldi">Garibaldi</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Cupo Máx"
            type="number"
            fullWidth
            variant="outlined"
            inputProps={{ min: 0 }}
            name="cupoMax"
            value={formValues.cupoMax}
            onChange={handleInputChange}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.weekdays.lunes}
                  onChange={handleWeekdayChange}
                  name="lunes"
                />
              }
              label="Lunes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.weekdays.martes}
                  onChange={handleWeekdayChange}
                  name="martes"
                />
              }
              label="Martes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.weekdays.miercoles}
                  onChange={handleWeekdayChange}
                  name="miercoles"
                />
              }
              label="Miércoles"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.weekdays.jueves}
                  onChange={handleWeekdayChange}
                  name="jueves"
                />
              }
              label="Jueves"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.weekdays.viernes}
                  onChange={handleWeekdayChange}
                  name="viernes"
                />
              }
              label="Viernes"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} color="warning">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchBar;