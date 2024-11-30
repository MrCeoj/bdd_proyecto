// pages/api/clases/[id].ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/lib";
import { deleteClase } from "@/app/data/clases";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.href.split("/").pop();

  if (req.method === "GET") {
    try {
      console.log(id);
      const parsed = Number(id);
      const clase = await prisma.clasesbasic.findUnique({
        where: { id: parsed },
        include: {
          clasesdetalles: true,
        },
      });
      console.log("API GET", clase);
      if (clase) {
        return NextResponse.json(clase);
      } else {
        return NextResponse.json({ error: "Clase no encontrada" }, {status: 404});
      }
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener la clase" }, {status: 500});
    }
  } else {
    return NextResponse.json({ error: "Método no permitido" }, {status: 405});
  }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.href.split("/").pop();
    if (req.method === "DELETE") {
        try {
        console.log(id);
        const parsed = Number(id);
        await deleteClase(parsed);
        return NextResponse.json({ message: "Clase eliminada" });
        } catch (error) {
        return NextResponse.json({ error: "Error al eliminar la clase" }, {status: 500});
        }
    } else {
        return NextResponse.json({ error: "Método no permitido" }, {status: 405});
    }
}