import { NextRequest, NextResponse } from "next/server";
import { obtenerClasesFiltros } from "@/app/data/clases";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const searchParams = req.nextUrl.searchParams;
      const filtros = {
        search: searchParams.get("search") || "",
        dias: JSON.parse(searchParams.get("dias") || "[]"),
        sucursales: JSON.parse(searchParams.get("sucursales") || "[]"),
        costos: JSON.parse(searchParams.get("costos") || "[]"),
      };
      console.log("API GET", filtros);

      const clases = await obtenerClasesFiltros(filtros);
      console.log(clases)
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