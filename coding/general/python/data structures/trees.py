class Expr:
    pass

class Times(Expr):
    def __init__(self, left, right) -> None:
        super().__init__()
        self.left = left
        self.right = right

    def __str__(self) -> str:
        return "(" + str(self.left) + " * " + str(self.right) + ")"

    def eval(self, env):
        return self.left.eval(env) * self.right.eval(env)

class Plus(Expr):
    def __init__(self, left, right) -> None:
        super().__init__()
        self.left = left
        self.right = right

    def __str__(self) -> str:
        return "(" + str(self.left) + " + " + str(self.right) + ")"

    def eval(self, env):
        return self.left.eval(env) + self.right.eval(env)

class Const(Expr):
    def __init__(self, val) -> None:
        super().__init__()
        self.val = val

    def __str__(self) -> str:
        return str(self.val)

    def eval(self, evn):
        return self.val


class Var(Expr):
    def __init__(self, name) -> None:
        super().__init__()
        self.name = name

    def __str__(self) -> str:
        return "\"" + str(self.name) + "\""

    def eval(self, evn):
        return env[self.name]


e1 = Times(Const(3), Plus(Var("y"), Var("x")))
e2 = Plus(Times(Const(3), Var("y")), Var("x"))

env = { "x": 2, "y": 4 }
print(env)
print(str(e1) + " = " + str(e1.eval(env)))
print(str(e2) + " = " + str(e2.eval(env)))
