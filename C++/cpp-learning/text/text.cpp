#include <iostream>

void replaceAll(std::string& str, std::string s, std::string t) {
  std::string::size_type n = 0;
  while ((n = str.find(s, n)) != std::string::npos) {
    str.replace(n, s.size(), t);
    n += t.size();
  }
}

std::string intent(int lvl) {
  if (lvl > 0) {
    return std::string(lvl * 4, ' ');
  }
  else {
    return "";
  }
}

int main()
{
  // Lowercase -> Uppercase
  // Can be done by applying a bit-mask on the letter.
  char lowerCase = 'a'; // a: 01100001 -> A: 01000001
  char mask = 0xDF; //        11011111
  printf("%c & 0xDF = %c\n", lowerCase, lowerCase & mask);

  // Replace all instances of a substring in a string
  std::string str = "I am a string!";
  std::cout << str << std::endl;
  replaceAll(str, "am", "was");
  std::cout << str << std::endl;

  // Multiply a string.
  for (int i = 0; i <= 4; i++) {
    std::cout << "-" << intent(i) << ": " << i << std::endl;
  }
}
