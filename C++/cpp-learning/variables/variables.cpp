// variables.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>

int main()
{
  // VARIABLE PROPERTIES
  // Variables are of specific types and each assumes a specific memory length (https://cplusplus.com/doc/tutorial/variables/).
  float height = 1.85;
  float weight = 110;
  float bmi = weight / (height * height);
  std::cout << "bmi: " << bmi << std::endl;

  char firstLetter = 'a';
  char secondLetter = 'B';

  int yearOfBirth = 1990;
  unsigned int uYearOfBirth = 1990;
  bool isOlderThan18 = (2022 - 1990) > 18;
  double averageGrade = 4.79;

  std::cout << "size of int: " << sizeof(yearOfBirth) << " bytes" << std::endl;
  std::cout << "int must be between: " << INT_MIN << " and " << INT_MAX << std::endl;
  std::cout << "size of usigned int: " << sizeof(uYearOfBirth) << " bytes" << std::endl;
  std::cout << "size of char: " << sizeof(firstLetter) << " bytes" << std::endl;
  std::cout << "size of bool: " << sizeof(isOlderThan18) << " bytes" << std::endl;
  std::cout << "size of float: " << sizeof(bmi) << " bytes" << std::endl;
  std::cout << "size of double: " << sizeof(averageGrade) << " bytes" << std::endl;

  // OVERFLOW
  // Increasing the variable constantly will result it in overflowing and starting again from its minimum value.
  std::cout << "Adding +1 to " << INT_MAX << " will result in " << (INT_MAX + 1) << " because of overflow." << std::endl;

  // CASTING
  // Sometimes variables can be converted from one type to another.
  std::cout << "A char (" << firstLetter << ") is equivalent to a number (" << (int)firstLetter << ")." << std::endl;
  std::cout << "A char (" << secondLetter << ") is equivalent to a number (" << int(secondLetter) << ")." << std::endl;
  // Other times information may be lost.
  std::cout << "Converting a float/double (" << averageGrade << ") to int (" << (int)averageGrade << ") results in loss of information." << std::endl;
}
