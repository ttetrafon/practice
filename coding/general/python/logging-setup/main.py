import atexit
import json
import logging.config
import logging.handlers
import pathlib

logger = logging.getLogger("my_app")

def setup_logging() -> None:
    config_file = pathlib.Path("./logging_config.json")
    with open(config_file) as lf:
        config = json.load(lf)
    logging.config.dictConfig(config)
    queue_handler = logging.getHandlerByName("queue_handler")
    if queue_handler is not None:
        queue_handler.listener.start()
        atexit.register(queue_handler.listener.stop)


def main() -> None:
    setup_logging()

    logger.debug("... debug!")
    try:
        err = 1 / 0
    except:
        logger.exception("... exception!")
    logger.info("... info!")
    logger.warning("... warning!")
    logger.error("... error!")
    logger.critical("... critical!")
    pass


if __name__ == "__main__":
    main()
