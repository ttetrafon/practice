#include "functions.h";

// A declaration and definition can be done at the same time before they are required.
void greetWorldMain() {
  std::cout << "'Hello World!' says the Main!" << std::endl;
}


int main()
{
  greetWorldMain();
  greetWorld();
  greetWorld("I am an overloaded function!");

  int a = 11;
  int b = 9;
  std::cout << a << " + " << b << " = " << add2(a, b) << std::endl;
  std::cout << a << " + " << "default" << " = " << add2(a, b) << std::endl;
  std::cout << a << " + ? = " << add2(a);
}
