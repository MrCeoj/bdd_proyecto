import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/lib";
import { crearClase } from "@/app/data/clases";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const clases = await prisma.clasesbasic.findMany({
        select: {
          id: true,
          nombre: true,
          costo: true,
          sucursal: true,
        },
      });
      console.log("API GET", clases);
      return NextResponse.json(clases);
    } catch (error) {
      return NextResponse.json(
        { error: "Error al obtener las clases" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
  }
}

export async function POST(req: NextRequest) {
  interface Clase {
    nombre: string;
    cupoMax: number;
    sucursal: string;
    costo: number;
    lunes: boolean;
    martes: boolean;
    miercoles: boolean;
    jueves: boolean;
    viernes: boolean;
  }
  if (req.method === "POST") {
    try {
      const data = await req.json();
      if (!data) return NextResponse.json({ error: "Datos no proporcionados" });

        const clase: Clase = {
            nombre: data.nombre,
            cupoMax: data.cupoMax,
            sucursal: data.sucursal,
            costo: data.costo,
            lunes: data.weekdays.lunes,
            martes: data.weekdays.martes,
            miercoles: data.weekdays.miercoles,
            jueves: data.weekdays.jueves,
            viernes: data.weekdays.viernes,
        };

        console.log("API POST", clase);

        await crearClase(clase);

        console.log("Clase creada");

      return NextResponse.json({ message: "Clase creada" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error al crear la clase" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
  }
}
