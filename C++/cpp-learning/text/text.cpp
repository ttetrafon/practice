#include <iostream>

int main()
{
  // Lowercase -> Uppercase
  // Can be done by applying a bit-mask on the letter.
  char lowerCase = 'a'; // a: 01100001 -> A: 01000001
  char mask = 0xDF; //        11011111
  printf("%c & 0xDF = %c", lowerCase, lowerCase & mask);


}
