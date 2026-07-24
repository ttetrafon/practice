struct U;

struct S {
  int x;

  S& operator=(const S& other) {
    x = other.x;
    // 'this' is a pointer to the instance of the class on which it has been called.
    // 'this' cannot be used within a static context.
    return *this;
  }
};

// 'this' can also be used in a 'brace-or-equal-initialiser' (again for a non-static member). 
struct T {

  T(const U* u);
  // ...
};
struct U {
  // ...
  T t{ this };
};
