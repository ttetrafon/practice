#include <iostream>
#include <vector>

using namespace std;

// Iterators are positions, and they are used to operate on sequences of any type.

int main()
{
  vector<int> my_vector = { 45, 79, 23, 12, 81, 55 };
  for (int i = 0; i < my_vector.size(); i++) {
    cout << "(" << i << ") " << my_vector[i] << (i < (my_vector.size() - 1) ? " - " : "");
  }
  cout << endl;
  auto my_iterator = my_vector.begin(); // position
  auto my_value = *my_iterator; // to get a value, dereference the iterator
  // The .end() iterator cannot be dereference, as it will be null.
  cout << "my_value = " << my_value << endl;
  cout << "my_value: *(++my_iterator) = " << *(++my_iterator) << endl;

  cout << "my_iterator = " << *(my_iterator) << endl;
  advance(my_iterator, 1);
  cout << "advance(my_iterator, 1) = " << *(my_iterator) << endl;
  my_iterator = next(my_iterator, 3);
  cout << "next(my_iterator, 3) = " << *(my_iterator) << endl;
  my_iterator = prev(my_iterator, 2);
  cout << "prev(my_iterator, 2) = " << *(my_iterator) << endl;

  // Distance between operators on the same sequence
  cout << "(my_vector.begin(), my_iterator) = " << distance(my_vector.begin(), my_iterator) << endl;

  // Insert operations do that in the position of the iterator.
  // Erase operations will return an iterator corresponding to the same position as the one passed in.
  // An iterator and its corresponding reverse iterator are located in the same position between elements.
  // An iterator is invalidated if its position is no longer a part of a sequence.
}
