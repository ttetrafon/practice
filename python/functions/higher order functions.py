from functools import partial
# https://www.youtube.com/watch?v=CnbgMnUCsUM


# --- --- ---   exec   --- --- ---
# exec can be used to interpret any string as code before executing it.abs
# Useful for creating and executing code snippets procedurally.

exec('print(\'Hello world!\')')


# --- --- ---   partial   --- --- ---
def specifications(colour: str, name: str, amount: int) -> None:
    print(f'Specs: {colour=}, {name=}, {amount=}.')

colour_and_name_specs: partial = partial(specifications, amount=10)
amount_specs: partial = partial(specifications, 'yellow', 'Bob')
colour_and_amount_specs: partial = partial(specifications, 'orange', amount=9)

specifications('red', 'tablecloth', 5)
colour_and_name_specs('red', 'tablecloth')
amount_specs(7)
amount_specs(21)
colour_and_amount_specs('cat')

