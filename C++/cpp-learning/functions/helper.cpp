#include "helper.h"

// Function definitions.

void greetWorld() {
  std::cout << "'Hello World!' says the Helper!" << std::endl;
}
void greetWorld(std::string msg) {
  std::cout << "'" << msg << "' says the Helper!" << std::endl;
}

int add2(int a, int b) {
  return a + b;
}
