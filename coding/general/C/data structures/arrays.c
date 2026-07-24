#include <stdio.h>

void print_array(int *arr, int size) {
  for (int i = 0; i < size; i++) {
    printf("\n[%u]: %u", i, arr[i]);
  }
  return;
}

void insert_at_index(int *arr, int size, int index, int value) {
  printf("\n---> insert_at_index(int *arr, int %i, int %i, int %i)", size, index, value);
  for (int i = size - 1; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value;
  return;
}

void merge_sorted_lists(int *arr1, int size1, int *arr2, int size2, int *target, int sizeT) {
  printf("---> merge_sorted_lists()");
  int index1 = 0;
  int index2 = 0;
  while(index1 + index2 < sizeT) {
    if (arr1[index1] <= arr2[index2]) {
      target[index1 + index2] = arr1[index1];
      index1++;
    }
    else {
      target[index1 + index2] = arr2[index2];
      index2++;
    }
  }
}

int main() {
  int a[10] = { 1, 2, 3, 4, 5, 6, 7 };
  // If fewer items than the ones required for initialisation are provided, the remaining are set at 0.

  printf("\n(a) array size: %u", sizeof(a));
  print_array(&a[0], 10);

  int b[10][10];
  // Multidimensional arrays can be initialised with all elements presented row-by-row as with a one-dimensional array.
  // c[2][3] = { 1, 2, 3, 4, 5, 6 };
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
      b[i][j] = (1 + i) * (1 + j);
    }
  }
  printf("\n(b) array size: %u", sizeof(b));
  for (int i = 0; i < 10; i++) {
    printf("\n");
    for (int j = 0; j < 10; j++) {
      printf(" %2u", b[i][j]);
    }
  }

  // Insert element at specified index.
  insert_at_index(&a[0], 10, 5, 99);
  print_array(&a[0], 10);

  // Merge two sorted arrays.
  int m1[8] = {1, 6, 9, 14, 15, 19, 25, 29};
  int m2[6] = {2, 4, 7, 10, 16, 18};
  int m3[14];
  merge_sorted_lists(&m1[0], 8, &m2[0], 6, &m3[0], 14);
  print_array(&m3[0], 14);
}
