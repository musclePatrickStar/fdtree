# 演示：Python 语法高亮
import os


class Greeter:
    """一个简单的问候器。"""

    def __init__(self, prefix: str = "Hello"):
        self.prefix = prefix

    def greet(self, name: str) -> str:
        # f-string 与变量
        return f"{self.prefix}, {name}!"


if __name__ == "__main__":
    g = Greeter()
    for name in ["Ada", "Bob"]:
        print(g.greet(name))
    print(os.cpu_count())
