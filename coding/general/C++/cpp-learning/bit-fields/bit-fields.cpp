#include <iostream>

// Bit-Fields are used to pack structures to reduce size.

struct FileAttributes {
  // The following attributes will occupy a single bit in memory each.
  unsigned int ReadOnly: 1;
  unsigned int Hidden: 1;
};

struct Date {
  unsigned int Year : 13; // 2^13 = 8192 years
  unsigned int Month : 4; // 2^4 = 16 values, for 1-12
  unsigned int Day : 5; // 2^5 = 32 for 28-31 days in a month
}; // This structure will use a total of 22 bits (sizeof = 4 bytes)

int main()
{
  Date d;
  d.Year = 2023;
  d.Month = 11;
  d.Day = 2;
  std::cout << d.Day << "/" << d.Month << "/" << d.Year << std::endl;
  std::cout << "sizeof(d) = " << sizeof(d) << std::endl;
}
