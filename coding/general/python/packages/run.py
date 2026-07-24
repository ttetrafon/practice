# from my_package import test
import my_package.test
import my_package.my_sub_package.test_inner

def main():
    # test.check()
    my_package.test.check()
    my_package.my_sub_package.test_inner.check()


if __name__ == "__main__":
    main()
