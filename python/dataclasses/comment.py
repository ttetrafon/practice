import inspect
from dataclasses import dataclass, field, astuple, asdict
from pprint import pprint

@dataclass(frozen=True, order=True)
class Comment:
    id: int = field()
    text: str = field(default="", hash=False)
    replies: list[int] = field(default_factory=list, compare=False, repr=False)

def main():
    comment = Comment(1, "test comment")
    print(comment)
    print(astuple(comment))
    print(asdict(comment))

    pprint(inspect.getmembers(Comment, inspect.isfunction))

if __name__ == '__main__':
    main()
