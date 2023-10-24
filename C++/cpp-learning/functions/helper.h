#pragma once
#include <iostream>

// Function declarations.

void greetWorld();

// Overloading a function means that it is defined with different combinations of inputs/outputs.
// Even language operators (like +) can be overloaded to change/augment their functionality.
void greetWorld(std::string msg);

// Default params can be specified only in funciton declarations.
int add2(int a, int b = 5);
