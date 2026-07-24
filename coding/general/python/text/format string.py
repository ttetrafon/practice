from typing import Any

# A class can implement format specifications to be used with f-strings.
class Book:
    def __init__(self, title: str, pages: int) -> None:
        self.title = title
        self.pages = pages

    def __format__(self, format_spec: Any) -> str:
        match format_spec:
            case 'time':
                return f'{self.pages / 60 :.2f}h'
            case 'caps':
                return self.title.upper()
            case _:
                raise ValueError(f'Unknown specifier for Book()')


def main() -> None:
    harry_potter: Book = Book("Harry Potter", 999)
    apocalypse: Book = Book("Apocalypse Now", 120)

    print(f'{apocalypse:caps}')
    print(f'Harry potter took {harry_potter:time} to read!')


if __name__ == "__main__":
    main()
