#include <iostream>
#include <array>

template <size_t N>
consteval auto obfuscate(const char(&input)[N]) {
  std::array<char, N> result{};
  for (size_t i = 0; i < N; ++i) {
    result[i] = input[i] ^ 1234;
  }
  return result;
}

int main() {
  constexpr auto output = obfuscate("HELLO WORD");

  // De-obfuscate
  for (char c : output) {
    if (c == '\0') break;
    std::cout << (char)((int)(c) ^ 1234);
  }
  std::cout << std::endl;
  return 0;
}
