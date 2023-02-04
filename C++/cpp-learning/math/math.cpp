#include <iostream>

int main()
{
  // Check if a number is an integer!
  float num1 = 12.0;
  bool isNum1Int = (int)num1 == num1;
  std::cout << num1 << (isNum1Int ? " is " : " isn't ") << "an integer!" << std::endl;
}
