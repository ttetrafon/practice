#include <iostream>
#include <bitset>

template <typename T>
T rightmostSetBitRemoved(T n) {
  return n & (n - 1);
}

template <typename T>
bool checkBit(T number, int position) {
  return (number << position) & 1LL;
}


int main()
{
  // Remove rightmost set bit
  short a = 22;
  short b = rightmostSetBitRemoved(a);
  std::cout << a << " [" << std::bitset<8 * sizeof(a)>(a) << "] -> " << b << " [" << std::bitset<8 * sizeof(b)>(b) << "]" << std::endl;

  // Set all bits to 1
  int c = -1;
  std::cout << c << " [" << std::bitset<8 * sizeof(c)>(c) << "]" << std::endl;

  std::bitset<10> d;
  d.set();
  std::cout << d << std::endl;

  // Toggle a bit
  int e = 200;
  std::cout << e << " [" << std::bitset<8 * sizeof(e)>(e) << "]" << std::endl;
  e ^= 1 << e;
  std::cout << e << " [" << std::bitset<8 * sizeof(e)>(e) << "]" << std::endl;

  std::bitset<4> f(std::string("0110"));
  std::cout << f << " [" << std::bitset<4>(f) << "]" << std::endl;
  f.flip(2);
  std::cout << "flip(2): " << f << " [" << std::bitset<4>(f) << "]" << std::endl;
  f.flip(0);
  std::cout << "flip(0): " << f << " [" << std::bitset<4>(f) << "]" << std::endl;
  f.flip();
  std::cout << "flip(): " << f << " [" << std::bitset<4>(f) << "]" << std::endl;

  // checking a bit: shift right to the required bit, and then apply '& 1'
  long int g = 25326217l;
  std::cout << g << " [" << std::bitset<8 * sizeof(g)>(g) << "]" << std::endl;
  int pos = 10;
  std::cout << "checking bit at position " << pos << ": " << checkBit(g, pos) << std::endl;

  std::bitset<4> h(std::string("1011"));
  pos = 1;
  bool bit_val = h.test(pos);
  std::cout << h << " [" << std::bitset<4>(h) << "]" << std::endl;
  std::cout << "checking bit at position " << pos << ": " << bit_val << std::endl;

  // counting bits set


  return 0;
}
