// flow-control.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <stdlib.h>
#include <time.h>

int main()
{
  // IF - ELSE
  srand(time(NULL));
  int num = rand() % 10;
  std::cout << "random number: " << num << std::endl;
  if (num == 0) {
    std::cout << "... got a zero!" << std::endl;
  }
  else if (num % 2 == 0) {
    std::cout << "... got an even number!" << std::endl;
  }
  else {
    std::cout << "... got an odd number!" << std::endl;
  }

}
