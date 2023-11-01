#include <iostream>
#include <vector>

using namespace std;

int main()
{
  // Initialisation
  int arrayOfInts1[5];
  int arrayOfInts2[3] = { 5, 7, 11 };
  int arrayOfInts3[] = { 5, 7, 11 };
  int arrayOfInts4[5] = { 5, 7, 11 }; // -> { 5, 7, 11, 0, 0 }
  char arrayOfChars1[5];
  char arrayOfChars2[5] = { 'a', 'b', 'c', 'd', 'e'};
  string arrayOfStrings[] = { "C++", "C" };

  unsigned int const n_rows = 3;
  unsigned int const n_cols = 3;
  int const matrix[n_rows][n_cols] = {
    {1, 0, 0},
    {0, 1, 7},
    {0, 0, 1}
  };

  unsigned int n = 10;
  int* dynamicallySizedArray = new int[n](); // () initialises the array with 0s
  // ...
  delete[] dynamicallySizedArray;

  vector<int> vectorOfInts; // zero sized
  vectorOfInts.push_back(10); // expands to size 10

  // Indexing (0-based)
  cout << "arrayOfInts4[3] = " << arrayOfInts4[3] << endl;
  cout << "matrix[1][2] = " << matrix[1][2]<< endl;

}
