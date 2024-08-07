class MyClass:
    a_class_attribute = 'This is a class attribute!'
    # A class attribute is considered 'static' and can be changed appropriately: MyClass.a_class_attribute = "this is a new value for the class attribute".a_class_attribute
    # It can still be overridden in any of the class instances by using that instance to access it.

    def __init__(self, instance_attribute):
        self.instance_attribute = instance_attribute

myClass1 = MyClass("1")
print(myClass1.instance_attribute, "->", myClass1.a_class_attribute)

myClass2 = MyClass("2")
print(myClass2.instance_attribute, "->", myClass2.a_class_attribute)

MyClass.a_class_attribute = "new static value"
myClass2.a_class_attribute = "overriding the static value on this instance"

print(myClass1.instance_attribute, "->", myClass1.a_class_attribute)
print(myClass2.instance_attribute, "->", myClass2.a_class_attribute)
