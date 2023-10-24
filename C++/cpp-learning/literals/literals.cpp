#include <iostream>
#include "structures.cpp"

int main()
{
    std::cout << "Hello World!\n";

    // decimal-liters
    int d = 42;
    // octa-literal: '0' followed by octal digits (0-7)
    int o = 052;
    // hex-liters: '0x' followed by hex digits (0-f)
    int x = 0x2a;
    // binrary-literal [C++14]: '0b' followed by binary digits (0, 1)
    int b = 0b011001;
    // integer-suffix: unsigned ('u'), long ('l') [C++11]
    unsigned int u = 42u;
    unsigned long long l1 = 18446744073709550592ull; // C++11
    unsigned long long l2 = 18'446'744'073'709'550'592llu; // C++14 unsigned long long l3 = 1844'6744'0737'0955'0592uLL; // C++14
    unsigned long long l4 = 184467'440737'0'95505'92LLU; // C++14


    // booleans: true, false


    // nulptr: null pointer constant that can be converted to to any pointer or pointer-to-member type, yielding a null pointer of the resulting type.
    S* s = new S();
    delete s;
    s = nullptr;
}
