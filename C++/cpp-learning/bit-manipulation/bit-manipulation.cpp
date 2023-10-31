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

template <typename T>
bool checkIfPowerOfTwo(T number) {
  return number && !(number & (number - 1));
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

  // Checking a bit: shift right to the required bit, and then apply '& 1'
  long int g = 25326217l;
  std::cout << g << " [" << std::bitset<8 * sizeof(g)>(g) << "]" << std::endl;
  int pos = 10;
  std::cout << "checking bit at position " << pos << ": " << checkBit(g, pos) << std::endl;

  std::bitset<4> h(std::string("1011"));
  pos = 1;
  bool bit_val = h.test(pos);
  std::cout << h << " [" << std::bitset<4>(h) << "]" << std::endl;
  std::cout << "checking bit at position " << pos << ": " << bit_val << std::endl;

  // Counting bits set
  // ... loop
  unsigned value = 1234;
  std::cout << value << " [" << std::bitset<8>(value) << "]: " << std::endl;
  unsigned bits = 0;
  for (bits = 0; value; value >>= 1) {
    bits += value & 1;
  }
  std::cout << "(loop) " << bits << " bits" << std::endl;
  // ... remove rightmost
  value = 1234;
  bits = 0;
  for (; value; ++bits) {
    value &= value - 1;
  }
  std::cout << "(remove rightmost) " << bits << " bits" << std::endl;

  // Check if power of two
  unsigned int n = 127;
  std::cout << n << " is power of 2: " << checkIfPowerOfTwo(n) << std::endl;
  n = 128;
  std::cout << n << " is power of 2: " << checkIfPowerOfTwo(n) << std::endl;

  // Setting a bit
  value |= 1LL << 2; // set 1 at position 2
  value &= 1LL << 2; // set 0 at position 2
  bool bb = 1; // or 0
  value ^= (-2 ^ value) & (1LL << bb); // sets 1/0 (depending on n) at position 2.

  std::bitset<5> i(std::string("10000"));
  std::cout << "num: " << i << " [" << std::bitset<5>(i) << "]" << std::endl;
  i.set(2); // or .set(2, true)
  std::cout << "set(2, true): " << i << " [" << std::bitset<5>(i) << "]" << std::endl;
  i.set(2, false); // or .reset(2)
  std::cout << "set(2, false): " << i << " [" << std::bitset<5>(i) << "]" << std::endl;



  return 0;
}
