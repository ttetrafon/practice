#include <stdio.h>

int main() {
  int a[10] = { 1, 2, 3, 4, 5, 6, 7 };
  // If fewer items than the ones required for initialisation are provided, the remaining are set at 0.

  printf("(a) array size: %u", sizeof(a));
  for (int i = 0; i < 10; i++) {
    printf("\n[%u]: %u", i, a[i]);
  }

  int b[10][10];
  // Multidimensional arrays can be initialised with all elements presented row-by-row as with a one-dimensional array.
  // c[2][3] = { 1, 2, 3, 4, 5, 6 };
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
      b[i][j] = (1 + i) * (1 + j);
    }
  }
  printf("(b) array size: %u", sizeof(b));
  for (int i = 0; i < 10; i++) {
    printf("\n");
    for (int j = 0; j < 10; j++) {
      printf(" %2u", b[i][j]);
    }
  }
}
