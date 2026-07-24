#include <iostream>
#include <stdlib.h>
#include <time.h>

int main()
{
  // IF - ELSE
  srand(time(NULL));
  int num = rand() % 10;
  std::cout << "random number: " << num << std::endl;
  if (num == 0)
  {
    std::cout << "(if-else) ... got a zero!" << std::endl;
  }
  else if (num % 2 == 0)
  {
    std::cout << "(if-else) ... got an even number!" << std::endl;
  }
  else
  {
    std::cout << "(if-else) ... got an odd number!" << std::endl;
  }

  // SWITCH
  switch (num)
  {
    case 0:
      std::cout << "(switch) ... got a zero!" << std::endl;
      break;
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
      std::cout << "(switch) ... got an odd number!" << std::endl;
      break;
    case 2:
    case 4:
    case 6:
    case 8:
    case 10:
      std::cout << "(switch) ... got an even number!" << std::endl;
      break;
    default:
      std::cout << "(switch) ... out of bounds!?!?" << std::endl;
      break;
  }

  // WHILE
  int i = 0;
  while (i <= 100) {
    if (i % 5 == 0 && i % 3 == 0) {
      std::cout << "  - " << i << " is divisible by both 3 and 5." << std::endl;
    }
    i++;
  }

  // DO WHILE
  int number = 6465844;
  int tempNum = number;
  int numberOfDigits = 0;
  do {
    tempNum = tempNum / 10;
    numberOfDigits++;
  } while (tempNum > 0);
  std::cout << number << " has " << numberOfDigits << " digits!" << std::endl;

  // FOR
  int seedNumber = 15;
  long int factorial = 1;
  for (int j = 1; j <= seedNumber; j++) {
    factorial *= j;
  }
  std::cout << seedNumber << "! = " << factorial << std::endl;
}
