import prisma from "@/app/utils/lib";

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

interface Filtros {
  dias: string[];
  sucursales: string[];
  costos: number[];
  search: string;
}

export async function crearClase(data: Clase) {
  //Validar que los datos sean correctos

  try {
    const parsedData = {
      nombre: data.nombre,
      costo: Number(data.costo), // Convert to number
      sucursal: data.sucursal,
      cupoMax: Number(data.cupoMax), // Convert to number
      lunes: data.lunes,
      martes: data.martes,
      miercoles: data.miercoles,
      jueves: data.jueves,
      viernes: data.viernes,
    };
    if (parsedData.costo < 0) {
      throw new Error("El costo no puede ser negativo");
    }
    if (parsedData.cupoMax < 0) {
      throw new Error("El cupo máximo no puede ser negativo");
    }
    // Crear la clase en clasesBasic, obtener el id del registro creado para llave foranea en clasesDetalles

    console.log(parsedData);
    const result = await prisma.$transaction(async (prisma) => {
      const clasesBasic = await prisma.clasesbasic.create({
        data: {
          nombre: parsedData.nombre,
          costo: parsedData.costo,
          sucursal: parsedData.sucursal,
        },
      });

      const clasesDetalles = await prisma.clasesdetalles.create({
        data: {
          id: clasesBasic.id,
          cupoMax: parsedData.cupoMax,
          lunes: parsedData.lunes,
          martes: parsedData.martes,
          miercoles: parsedData.miercoles,
          jueves: parsedData.jueves,
          viernes: parsedData.viernes,
        },
      });

      return { clasesBasic, clasesDetalles };
    });

    console.log("Clase y detalles creados:", result);
  } catch (error) {
    console.error("Error al crear la clase", error);
  }
}

export async function obtenerClases() {
  return await prisma.clasesbasic.findMany({});
}

export async function obtenerDetallesClase(id: number) {
  return await prisma.clasesdetalles.findMany({
    where: {
      id: id,
    },
  });
}

export async function obtenerClasesFiltros(filtros: Filtros) {
  const { search, dias, sucursales, costos } = filtros;

  console.log("Filtros:", filtros);

  try {
    const clases = await prisma.clasesbasic.findMany({
      where: {
        AND: [
          // Filter by search keyword if provided
          ...(search
            ? [
                {
                  nombre: {
                    contains: search,
                  },
                },
              ]
            : []),
          ...(sucursales.length > 0
            ? [
                {
                  sucursal: {
                    in: sucursales,
                  },
                },
              ]
            : []),
          // Filter by costo range
          {
            costo: {
              gte: costos[0],
              lte: costos[1],
            },
          },
          // Filter by available days
          {
            clasesdetalles: {
              OR: dias.map((dia) => ({
                [dia]: true,
              })),
            },
          },
        ],
      },
      include: {
        clasesdetalles: true,
      },
    });

    console.log("Filtered classes:", clases);
    return clases;
  } catch (error) {
    console.error("Error fetching filtered classes:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}


export async function deleteClase(id: number) {
  try {
    
    const clase = await prisma.clasesbasic.findUnique({
        where: {
            id: id,
        },
    });

    if (!clase) {
        throw new Error("Clase no encontrada");
    }

    // transaction to delet class and details
    const result = await prisma.$transaction(async (prisma) => {
      await prisma.clasesdetalles.deleteMany({
        where: {
          id: id,
        },
      });

      await prisma.clasesbasic.delete({
        where: {
          id: id,
        },
      });
    });

    console.log("Clase eliminada:", result);
  } catch (error) {
    console.error("Error al eliminar la clase", error);
  }
}