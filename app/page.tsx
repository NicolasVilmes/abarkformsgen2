"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Construction } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <Construction className="w-12 h-12 text-abark mx-auto mb-4" />
        <h1 className="text-2xl font-semibold">Página em Construção</h1>
        <p className="text-gray-600 mt-2">
          Estamos trabalhando para trazer a melhor experiência para você. Em
          breve, esta página estará disponível.
        </p>
        <Button
          className="mt-6 bg-abark hover:bg-abark-dark text-white px-6 py-3"
          onClick={() => router.push("/EstruturasPT")}
        >
          Acessar Formulário
        </Button>
      </div>
    </div>
  );
}
