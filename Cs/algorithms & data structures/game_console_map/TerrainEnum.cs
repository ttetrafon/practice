using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace game_console_map {

	public enum TerrainEnum {
		GRASS,
		SAND,
		WATER,
		WALL
	}

	public static class TerrainEnumExtensions {

		public static ConsoleColor GetColour( this TerrainEnum terrain ) {
			switch ( terrain ) {
				case TerrainEnum.GRASS:
					return ConsoleColor.Green;
				case TerrainEnum.SAND:
					return ConsoleColor.Yellow;
				case TerrainEnum.WATER:
					return ConsoleColor.Blue;
				default:
					return ConsoleColor.DarkGray;
			}
		}

		public static char GetSymbol( this TerrainEnum terrain ) {
			switch ( terrain ) {
				case TerrainEnum.GRASS:
					return '\u201c';
				case TerrainEnum.SAND:
					return '\u25cb';
				case TerrainEnum.WATER:
					return '\u2248';
				default:
					return '\u25cf';
			}
		}

	}
}
