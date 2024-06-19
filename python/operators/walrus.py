# Walrus Operator (:=)

users: dict[int, str] = {
    0: 'Bob',
    1: 'Maria',
    5: 'Nakis',
    9: 'Vi'
}

# The walrus operator can be used instead of the following:
user: str | None = users.get(1)
if user:
    print(f'{user} exists!')
else:
    print('No user found...')

# ... meaning that we don't need to define the user object specifically
if us := users.get(3):
    print(f'{user} exists!')
else:
    print('No user found...')


# Can also be used for inline assignment.
def get_info(text: str) -> dict:
    return {
        'words': (words := text.split()),
        'word_count': len(words),
        'character_count': len(''.join(words))
    }

print(get_info("This is some text..."))
