using System;
using System.Text;

namespace game_console_map {
	class Program {
		static void Main( string[] args ) {

			TerrainEnum[,] map = new TerrainEnum[3, 3] {
				{ TerrainEnum.GRASS, TerrainEnum.GRASS, TerrainEnum.WALL },
				{ TerrainEnum.WATER, TerrainEnum.WATER, TerrainEnum.WALL },
				{ TerrainEnum.SAND, TerrainEnum.WATER, TerrainEnum.WALL }
			};

			Console.OutputEncoding = UTF8Encoding.UTF8;

			for (int i = 0; i < map.GetLength(1); i++ ) {
				for (int j = 0; j < map.GetLength(0); j++ ) {
					Console.ForegroundColor = map[i, j].GetColour();
					Console.Write( map[i, j].GetSymbol() + " " );
				}
				Console.WriteLine( "" );
			}
			Console.ForegroundColor = ConsoleColor.Gray;
			Console.WriteLine( "Press any key to exit..." );
			Console.ReadKey();
		}
	}
}
