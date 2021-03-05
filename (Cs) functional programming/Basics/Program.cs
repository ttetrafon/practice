using System;
using System.Linq;
using System.Threading.Tasks;

namespace Basics {
	class Program {
		static void Main(string[] args) {
			Triples();
			SortAndFilter();
			MutableState();

			Console.WriteLine("--- --- ---");
		}

		private static void Triples() {
			Console.WriteLine("---> Triples()");
			Func<int, int> triple = x => x * 3;
			var range = Enumerable.Range(1, 10);
			var triples = range.Select(triple);

			foreach (int t in triples) {
				Console.WriteLine(t);
			}
			Console.WriteLine("");
		}

		private static void SortAndFilter() {
			Console.WriteLine("---> SortAndFilter()");
			Func<int, bool> isOdd = x => x % 2 == 1;

			int[] original = { 7, 1, 6, 8, 2, 3, 5, 4, 9 };
			Console.WriteLine("original:");
			foreach (int t in original) {
				Console.WriteLine(t);
			}

			var sorted = original.OrderBy(x => x);
			Console.WriteLine("sorted:");
			foreach (int t in sorted) {
				Console.WriteLine(t);
			}

			var filtered = original.Where(isOdd);
			Console.WriteLine("filtered:");
			foreach (int t in filtered) {
				Console.WriteLine(t);
			}
			Console.WriteLine("");
		}

		private static void MutableState() {
			Console.WriteLine("---> MutableState()");
			var nums = Enumerable.Range(-10000, 20001).Reverse().ToList();

			Action task1 = () => Console.WriteLine(nums.Sum());
			Action task2 = () => {
				nums.Sort();
				Console.WriteLine(nums.Sum());
			};
			Action task3 = () => Console.WriteLine(nums.OrderBy(x => x).Sum());

			//Parallel.Invoke(task1, task2); // Sort modifies the initial list, so task1 fails.
			Parallel.Invoke(task1, task3); // OrderBy does not modify the initial list, so both tasks work as expected.
			Console.WriteLine("");
		}

	}
}
