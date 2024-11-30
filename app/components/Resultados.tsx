"use client";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Delete from "@mui/icons-material/Delete";
import useFiltersStore from "../hooks/zustand";

interface Clase {
  id: number;
  nombre: string;
  costo: number;
  sucursal: string;
}

interface ClaseDetalles {
  cupoMax: number;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
}

const Resultados = () => {
  const { rows, setRows } = useFiltersStore();
  const [details, setDetails] = useState<{ [key: number]: ClaseDetalles[] }>(
    {}
  );
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await fetch("/api/clases");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClases();
  }, []);

  const fetchDetails = async (id: number) => {
    setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
    setError((prevError) => ({ ...prevError, [id]: "" }));

    try {
      const response = await fetch(`/api/clases/${id}`);
      if (!response.ok) {
        throw new Error("Error fetching class details");
      }
      const data = await response.json();
      setDetails((prevDetails) => ({
        ...prevDetails,
        [id]: Array.isArray(data.clasesdetalles)
          ? data.clasesdetalles
          : [data.clasesdetalles],
      }));
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError((prevError) => ({
        ...prevError,
        [id]: "Error fetching class details",
      }));
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
    }
  };

  function Row(props: { row: Clase }) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const handleExpandClick = () => {
      setOpen(!open);
      if (!details[row.id] && !loading[row.id]) {
        fetchDetails(row.id);
      }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/api/clases/${row.id}`, {
            method: "DELETE",
            });
            if (!response.ok) {
            throw new Error("Error deleting class");
            }
            const data = await response.json();
            console.log(data);
            const newRows = rows.filter((r) => r.id !== row.id);
            setRows(newRows);
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    }

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "1px solid #EBF4FF" } }}>
          <TableCell component="th" scope="row" sx={{ color: "#EBF4FF" }}>
            {row.nombre}
          </TableCell>
          <TableCell align="right" sx={{ color: "#EBF4FF" }}>
            ${row.costo}
          </TableCell>
          <TableCell align="right" sx={{ color: "#EBF4FF" }}>
            {row.sucursal}
          </TableCell>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleExpandClick}
              sx={{ color: "#EBF4FF" }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <IconButton 
                aria-label="delete row"
                size="small"
                onClick={handleDeleteClick}
                sx={{ color: "#EBF4FF" }}    
            >
              <Delete className="ml-2+" />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              backgroundColor: "#212138",
            }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, color: "#EBF4FF" }}>
                {loading[row.id] ? (
                  <div>Cargando...</div>
                ) : error[row.id] ? (
                  <div>{error[row.id]}</div>
                ) : (
                  <Table size="small" aria-label="detalles">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#EBF4FF" }}>Horario</TableCell>
                        <TableCell align="right" sx={{ color: "#EBF4FF" }}>
                          Cupo Máx.
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(details[row.id]) &&
                        details[row.id].map((detalle, idx) => (
                          <TableRow key={idx}>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ color: "#EBF4FF" }}
                            >
                              <span
                                className={
                                  detalle.lunes
                                    ? "text-accent mr-2"
                                    : "text-text text-opacity-20 mr-2"
                                }
                              >
                                Lunes
                              </span>
                              <span
                                className={
                                  detalle.martes
                                    ? "text-accent mr-2"
                                    : "text-text text-opacity-20 mr-2"
                                }
                              >
                                Martes
                              </span>
                              <span
                                className={
                                  detalle.miercoles
                                    ? "text-accent mr-2"
                                    : "text-text text-opacity-20 mr-2"
                                }
                              >
                                Miércoles
                              </span>
                              <span
                                className={
                                  detalle.jueves
                                    ? "text-accent mr-2"
                                    : "text-text text-opacity-20 mr-2"
                                }
                              >
                                Jueves
                              </span>
                              <span
                                className={
                                  detalle.viernes
                                    ? "text-accent mr-2"
                                    : "text-text text-opacity-20 mr-2"
                                }
                              >
                                Viernes
                              </span>
                            </TableCell>
                            <TableCell align="right" sx={{ color: "#EBF4FF" }}>
                              {detalle.cupoMax}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <article className="w-4/5 flex flex-col gap-4">
      <span className="text-2xl font-bold flex flex-col p-0">
        Resultados de búsqueda
        <span className="border-solid border-b-4 border-text w-1/6"></span>
      </span>
      <div className="border-solid border-2 border-text bg-front p-6 overflow-y-scroll overflow-x-auto h-full max-h-full">
        <TableContainer
          className="text-text font-inria"
          component={Paper}
          sx={{
            background: "transparent",
            borderBottom: "2px solid white",
            borderTop: "0px solid white",
          }}
        >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#EBF4FF",
                    borderBottom: "1px solid #EBF4FF",
                    borderTopColor: "#0A0A14",
                  }}
                >
                  <span className="font-bold text-2xl font-inria">Clase</span>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#EBF4FF", borderBottom: "1px solid #EBF4FF" }}
                >
                  <span className="font-bold text-2xl font-inria">Costo</span>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#EBF4FF", borderBottom: "1px solid #EBF4FF" }}
                >
                  <span className="font-bold text-2xl font-inria">
                    Sucursal
                  </span>
                </TableCell>
                <TableCell
                  sx={{ color: "#EBF4FF", borderBottom: "1px solid #EBF4FF" }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </article>
  );
};

export default Resultados;
