#include <iostream>


class student {
private:
  std::string name;
  bool pass;
public:
  void setName(std::string name);
  std::string getName();
  bool hasPassed();
};

void student::setName(std::string name) {
  student::name = name;
}
std::string student::getName() {
  return name;
}
bool student::hasPassed() {
  return pass;
}


int main()
{
  student *s1 = new student;
  s1->setName("Nakis");
  std::cout << s1->getName() << std::endl;
}
