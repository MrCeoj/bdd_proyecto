"use client";

import { Checkbox, cn } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Box } from '@mui/system';
import { Slider } from "@mui/material";
import useFiltersStore from "@/app/hooks/zustand"

const Filtros = () => {

  const { 
    dias, 
    sucursales, 
    costos,
    setDias, 
    setSucursales, 
    setCostos,
  } = useFiltersStore();

  let diasList = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  let sucursalesList = ["Villafontana", "Las Fuentes", "Garibaldi"];

  useEffect(() => {
    console.log(dias);
  }, [dias]);

  useEffect(() => {
    console.log(sucursales);
  }, [sucursales]);

  useEffect(() => {
    console.log(costos);
  }, [costos]);

  const handleDiaSelect = (value: boolean, name: string) => {
    if (value) {
      setDias([...dias, name]);
    } else {
      setDias(dias.filter((dia) => dia !== name));
    }
  };

  const handleSelectAllDias = (value: boolean) => {
    if (value) {
      setDias(diasList);
    } else {
      setDias([]);
    }
  };
  function valuetext(value: number) {
    return `${value}°C`;
  }

  interface SliderValueLabelProps {
    children: React.ReactElement<any>;
  }
  
  function SliderValueLabel({ children }: SliderValueLabelProps) {
    return <span className="valueLabel">{children}</span>;
  }
  

  const handleSucursalSelect = (value: boolean, name: string) => {
    if (value) {
      setSucursales([...sucursales, name]);
    } else {
      setSucursales(sucursales.filter((sucursal) => sucursal !== name));
    }
  };

  const handleSelectAllSucursales = (value: boolean) => {
    if (value) {
      setSucursales(sucursalesList);
    } else {
      setSucursales([]);
    }
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setCostos(newValue as [number, number]);
  };

  const getCheckboxStyles = (isSelected: boolean) => ({
    wrapper: cn("inline-flex w-4 h-4 border-2 text-text", {
      "bg-text border-text rounded-sm": isSelected,
      "border-text rounded-sm": !isSelected,
    }),
    label: ["ml-2"],
  });

  return (
    <article className="w-1/5 flex flex-col gap-4">
      <span className="text-2xl font-bold flex flex-col p-0">
        Filtros
        <span className="border-solid border-b-4 border-text w-1/6"></span>
      </span>
      <div className="border-solid border-2 border-text bg-front p-6">
        <span className="text-xl font-bold flex flex-col p-0">
          Horario
          <span className="border-solid border-b-2 border-text w-1/5"></span>
        </span>
        <div className="flex flex-col pt-2">
          <Checkbox
            isSelected={dias.length === diasList.length}
            onValueChange={(value = dias.length === diasList.length) =>
              handleSelectAllDias(value)
            }
            size="sm"
            classNames={getCheckboxStyles(dias.length === diasList.length)}
          >
            Marcar todas
          </Checkbox>
          <span className="border-solid border-b-2 border-text w-2/4"></span>
          <div className="flex flex-col gap-2 mt-2">
            {diasList.map((dia) => (
              <Checkbox
                key={dia}
                isSelected={dias.includes(dia)}
                onValueChange={(value = dias.includes(dia)) =>
                  handleDiaSelect(value, dia)
                }
                size="sm"
                classNames={getCheckboxStyles(dias.includes(dia))}
              >
                {dia.toUpperCase()}
              </Checkbox>
            ))}
          </div>
        </div>

        <span className="text-xl font-bold flex flex-col p-0 mt-6">
          Sucursales
          <span className="border-solid border-b-2 border-text w-2/5"></span>
        </span>
        <div className="flex flex-col pt-2">
          <Checkbox
            isSelected={sucursales.length === sucursalesList.length}
            onValueChange={(
              value = sucursales.length === sucursalesList.length
            ) => handleSelectAllSucursales(value)}
            size="sm"
            classNames={getCheckboxStyles(
              sucursales.length === sucursalesList.length
            )}
          >
            Marcar todas
          </Checkbox>
          <span className="border-solid border-b-2 border-text w-2/4"></span>
          <div className="flex flex-col gap-2 mt-2">
            {sucursalesList.map((sucursal) => (
              <Checkbox
                key={sucursal}
                isSelected={sucursales.includes(sucursal)}
                onValueChange={(value = sucursales.includes(sucursal)) =>
                  handleSucursalSelect(value, sucursal)
                }
                size="sm"
                classNames={getCheckboxStyles(sucursales.includes(sucursal))}
              >
                {sucursal}
              </Checkbox>
            ))}
          </div>
        </div>
        <span className="text-xl font-bold flex flex-col p-0 mt-6">
          Costo
          <span className="border-solid border-b-2 border-text w-1/6"></span>
        </span>
        <div className="flex flex-col gap-2 items-start max-w-md justify-center mt-3">
          <Box sx={{ width: 140 }}>
            <Slider
              value={costos}
              aria-label="Costos"
              onChange={handleChange}
              getAriaLabel={() => "MXN"}
              getAriaValueText={valuetext}
              min={0}
              max={1200}
              shiftStep={50}
              step={50}
              color="secondary"
              slots={{ valueLabel: SliderValueLabel }}
            />
          </Box>
        </div>
        <span>
            ${costos[0]} - ${costos[1]} MXN
        </span>
      </div>
    </article>
  );
};

export default Filtros;
