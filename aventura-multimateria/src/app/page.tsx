"use client";
import React from "react";
import Link from "next/link";
import { BookOpen, BookOpenCheck, Gamepad2, Calculator, MapPin, Bot, Beaker } from "lucide-react";

const minigames = [
	{
		code: "puerto-palabras",
		name: "Puerto de las Palabras",
		description: "Arrastra palabras a su categoría y practica ortografía.",
		icon: <Gamepad2 size={32} className="text-blue-600" />,
		path: "/world/puerto-palabras",
	},
	{
		code: "bosc-lectura",
		name: "Bosc de Lectura",
		description: "Llegeix textos i respon preguntes per il·luminar el bosc!",
		icon: <BookOpen size={32} className="text-green-700" />,
		path: "/world/bosc-lectura",
	},
	{
		code: "mercado-numeros",
		name: "Mercado de Números",
		description: "Resuelve problemas de dinero, tiempo y fracciones ayudando al tendero.",
		icon: <Calculator size={32} className="text-orange-600" />,
		path: "/world/mercado-numeros",
	},
	{
		code: "mision-mapamundi-v2",
		name: "Misión Mapamundi",
		description: "Practica geografía: continentes, océanos o CCAA de España en el mapa interactivo.",
		icon: <MapPin size={32} className="text-blue-500" />,
		path: "/world/mision-mapamundi-v2",
	},
	{
		code: "desafio-steam",
		name: "Desafío STEAM",
		description: "Programa un robot explorador con bloques visuales para llegar a la meta.",
		icon: <Bot size={32} className="text-purple-600" />,
		path: "/world/desafio-steam",
	},
	{
		code: "laboratorio-flip",
		name: "Laboratorio Flip-Ciencia",
		description: "Aprende ciencia viendo videos educativos y respondiendo quiz interactivos.",
		icon: <Beaker size={32} className="text-teal-600" />,
		path: "/world/laboratorio-flip",
	},
];

export default function Dashboard() {
	return (
		<>
			<main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-start p-8">
				<h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
					<BookOpenCheck size={36} className="text-blue-700" />
					ExplorAventura 3: Minijuegos
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-full max-w-7xl">
					{minigames.map((game) => (
						<Link
							key={game.code}
							href={game.path}
							className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border-2 border-blue-200 hover:border-blue-400"
						>
							{game.icon}
							<span className="text-xl font-semibold mt-2 mb-1 text-blue-800">
								{game.name}
							</span>
							<span className="text-gray-600 text-center">
								{game.description}
							</span>
						</Link>
					))}
				</div>
			</main>
			<footer className="w-full text-center py-4 mt-8 text-gray-500 text-sm">
				&copy; 2025 Edmundo Rosales Mayor
			</footer>
		</>
	);
}
