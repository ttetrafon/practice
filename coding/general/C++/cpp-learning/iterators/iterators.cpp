#include <iostream>
#include <map>
#include <vector>

using namespace std;

// Iterators are positions, and they are used to operate on sequences of any type.
// Types of operators:
// - input: can be dereferenced only once per position; can only advance; advances a single position at a time
// - forward: as input, but can be dereferenced multiple times per position
// - bidirectional: like forwards, but can backtrack one position at a time
// - random access: like bidirectional, but can move forwards and backwards any number of positions at a time
// - contiguous (C++ 17): random access, with that guarantees underlying data are contiguous in memory

// Insert operations do that in the position of the iterator.
// Erase operations will return an iterator corresponding to the same position as the one passed in.
// An iterator and its corresponding reverse iterator are located in the same position between elements.
// An iterator is invalidated if its position is no longer a part of a sequence.

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

  // vector operator
  // - begin() returns an iterator to the first element in sequence container
  // - end() returns an iterator to the first element past the end
  vector<int> v = { 11, 22, 33, 44, 55 };
  for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) {
    cout << *it << " ";
  }
  cout << endl;

  // map iterator
  // - if a map object is const qualified, the function returns a `const_iterator`, otherwise a generic `iterator`
  map<char, int> my_map;
  my_map['a'] = 100;
  my_map['b'] = 300;
  my_map['c'] = 200;
  for (map<char, int>::iterator it = my_map.begin(); it != my_map.end(); ++it) {
    cout << it->first << " -> " << it->second << endl;
  }

  // reverse iterator
  // - a bidirectional/random access iterator
  // - use `rbegin()` and `rend()` to get start and finish positions for reverse operations
  for (vector<int>::reverse_iterator it = v.rbegin(); it != v.rend(); ++it) {
    cout << *it << " ";
  }
  cout << endl;
  // - can be chaned to a forward iterator via `.base()`
  vector<int>::reverse_iterator r_v_it = v.rbegin();
  vector<int>::iterator f_v_it = r_v_it.base();


}
