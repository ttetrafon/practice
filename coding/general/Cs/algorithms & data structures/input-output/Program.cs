using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace input {
	class Program {
		static void Main( string[] args ) {
			Console.WriteLine( "Name: " );
			string fullName = Console.ReadLine();

			Console.WriteLine( "Age: " );
			string ageInput = Console.ReadLine();
			if (!int.TryParse( ageInput, out int age )) {
				age = -1;
			}

			//string dateTimeInput = Console.ReadLine();

			//if ( !DateTime.TryParseExact(
			//		dateTimeInput,
			//		"dd/mm/yyy HH:mm",
			//		new CultureInfo("en-UK"),
			//		DateTimeStyles.None,
			//		out DateTime dateTime
			//	) ) {
			//	dateTime = DateTime.Now;
			//}

			//ConsoleKeyInfo key = Console.ReadKey();
			//switch (key.Key) {
			//	case ConsoleKey.S:
			//		/* Pressed S */
			//		break;
			//	case ConsoleKey.F1:
			//		/* Pressed F1 */
			//		break;
			//	case ConsoleKey.Escape:
			//		/* Pressed Escape */
			//		break;
			//}

			Console.Write( "Hello World!" );
			Console.WriteLine( "... this will end the world!" );
			Console.WriteLine( "{0} is of age {1}!", fullName, age );

			Console.Write( "END - press any key to exit..." );
			Console.ReadKey();
		}
	}
}
