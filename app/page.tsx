
import SearchBar from "@/app/components/SearchBar";
import Filtros from "@/app/components/Filtros";
import Resultados from "@/app/components/Resultados";

export default function Page() {


  return (
    <main className="w-screen h-screen bg-back px-14 py-16 font-inria">
      <header className="w-full">
        <h1 className="text-5xl text-text font-bold">Consulta de Clases</h1>
        <SearchBar />
      </header>
      <div className="flex flex-row gap-16 w-4/5 mt-12 text-text">
        <Filtros />
        <Resultados />
      </div>
    </main>
  );
}