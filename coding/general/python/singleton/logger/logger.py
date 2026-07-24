class Logger():
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print('creating the Logger')
            cls._instance = super(Logger, cls).__new__(cls)
        else:
            print('... Logger already exists')
        return cls._instance
