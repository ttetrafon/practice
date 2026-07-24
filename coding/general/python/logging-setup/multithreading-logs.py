from pathlib import Path
import atexit
import json
import logging
import logging.config
import logging.handlers
import queue
import threading

# Setup logging
config_file = Path("./logging_config_multithreading.json")
with open(config_file) as lf:
    config = json.load(lf)
    print(f"... configuration: {config}")

# Create the queue and assign it
log_queue = queue.Queue()
config['handlers']['queue_handler']['queue'] = log_queue
logging.config.dictConfig(config)

# Create the handlers
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(logging.Formatter(config['formatters']['simple']['format']))
file_handler = logging.handlers.RotatingFileHandler(
        config['handlers']['file']['filename'],
        maxBytes=config['handlers']['file']['maxBytes'],
        backupCount=config['handlers']['file']['backupCount']
    )
file_handler.setFormatter(logging.Formatter(config['formatters']['detailed']['format'], datefmt=config['formatters']['detailed']['datefmt']))
# for handler_name in config['handlers']:
#     if handler_name != 'queue_handler':
#         handler_config = config['handlers'][handler_name]
#         handler_class = logging.config._resolve(handler_config['class'])
#         handler = handler_class(**{k: v for k, v in handler_config.items() if k not in ['class', 'formatter']})
#         formatter = logging.config._resolve(config['formatters'][handler_config['formatter']]['class'])
#         handler.setFormatter(formatter(**config['formatters'][handler_config['formatter']]))
#         handlers.append(handler)

# Create the listener
# queue_listener = logging.handlers.QueueListener(log_queue, *handlers)
queue_listener = logging.handlers.QueueListener(
    log_queue,
    stream_handler,
    file_handler
)
queue_listener.start()
atexit.register(queue_listener.stop)

def worker(thread_id):
    logger = logging.getLogger()
    logger.debug(f"Debug message from thread {thread_id}")
    logger.info(f"Info message from thread {thread_id}")
    logger.warning(f"Warning message from thread {thread_id}")
    logger.error(f"Error message from thread {thread_id}")
    logger.critical(f"Critical message from thread {thread_id}")

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
