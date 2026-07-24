# Logging

- Links:
  - [Modern Python logging](https://www.youtube.com/watch?v=9L77QExPmI0)
  - [documentation](https://docs.python.org/3/library/logging.html)
- Logging in python is handled through the internal logging module.
- The logging module creates a `logger tree`, based on the individual logger names.
  - e.g.: Logger() -> root logger, Logger('A') -> child of root, Logger('A.B') -> child of A, Logger('B') -> child of root
- Logging messages propagate from child to parent, and are handled by all of them in turn.
  - A message dropped by any handler in the process won't propagate to the parent.
  - For most applications, we need handlers, filters, and formatters only on the root logger.
    - Despite of this, always use an app/component specific logger.
- Logging is a blocking operations, so, it should be running on a different thread for time critical processes.
  - For this, we need a `queue_handler`.
