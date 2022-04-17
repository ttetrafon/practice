function func(channel, ...args) {
  console.log("---> func()", channel, args);
};

func("menu", 1);
func("main", 5, "user");
