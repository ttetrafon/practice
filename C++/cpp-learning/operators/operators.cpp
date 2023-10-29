#include <iostream>

int main()
{
  // ARITHMENTIC
  // 'a + b' adds
  // 'a - b' subtracts
  // 'a * b' multiplies
  // 'a / b' divides
  // 'a % b' returns the remainder of integer division
  // 'a++' increments (post)
  // '--a' increments (pre)
  // 'a--' decrements (post)
  // '--a' decrements (pre)
  int a = 1;
  std::cout << a++ / 2 << std::endl;
  std::cout << a << std::endl;
  int b = 1;
  std::cout << ++b / 2 << std::endl;
  std::cout << b << std::endl;

  // BOOLEAN
  // 'a < b' compares if less
  // 'a > b' compares if more
  // 'a == b' compares if equal
  // 'a <= b' compares if less or equal
  // 'a >= b' compares if more or equal
  // 'a != b' compares if different
  // '!a' not
  // 'a && b' and
  // 'a || b' or (and has precedence over or)
  // 'a ? b : c' ternary (if 'a' then do 'b', else do 'c')
  // Note that && and || are short-circuited, so if the first argument is false, then the second argument is never evaluated to avoid doing extra work.

  // ASSIGNMENT
  // 'variable = value' assigns a value to variable
  // 'variable += value' reassigns the initial value after adding the new value
  // 'variable -= value' reassigns the initial value after subtracting the new value
  // 'variable *= value' reassigns the initial value after multiplying with the new value
  // 'variable /= value' reassigns the initial value after dividing with the new value
  // 'variable %= value' reassigns the initial value after getting the modulo with the new value

  // BITWISE
  // 'a | b' bitwise or
  // 'a ^ b' bitwise xor (exclusive or): 0^0=0, 1^0=1, 0^1=1, 1^1=0)
  // 'a & b' bitwise and
  // 'a << #' left shift: moves bits # places to the left padding the rightmost digits with 0s
  //     e.g.: 5 (00000101) << 1 = 80 (01010000)
  // 'a >> #' right shift
  int bitA = 5;
  int bitB = 12;
  int bitC = bitA | bitB;
  std::cout << "\na = " << bitA << ", b = " << bitB << ", c = " << bitC << std::endl;
}
