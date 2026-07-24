import string
import unittest
print("... staring!")


def encrypt(message):
  abc = string.ascii_letters + string.punctuation + string.digits + " "
  print(abc)
  encrypted_message = "".join([abc[abc.find(char) + 1] if len(abc) > (abc.find(char) + 1) else abc[0] for index, char in enumerate(message)])
  return encrypted_message


class TestSelf(unittest.TestCase):
  def setUp(self):
    self.my_message = "banana 236!"

  # tests!
  def test_inputExists(self):
    self.assertIsNotNone(self.my_message)

  def test_inputType(self):
    self.assertIsInstance(self.my_message, str)

  def test_outputExists(self):
    self.assertIsNotNone(encrypt(self.my_message))

  def test_outputType(self):
    self.assertIsInstance(encrypt(self.my_message), str)

  def test_inputOutputLengthMatch(self):
    self.assertEqual(len(self.my_message), len(encrypt(self.my_message)))

  def test_inputOutputAreDifferent(self):
    self.assertNotEqual(self.my_message, encrypt(self.my_message))

  def test_shiftCipher(self):
    expected = "cboboba347\""
    self.assertEqual(encrypt(self.my_message), expected)


if __name__ == "__main__":
  unittest.main()
