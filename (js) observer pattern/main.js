import TechThread from './subjects/TechThread.js';
import DesignThread from './subjects/DesignThread.js';
import TechThreadObserver from './observers/TechThreadObserver.js';
import DesignThreadObserver from './observers/DesignThreadObserver.js';

function init() {
    /* We instanciate our subjects */
    const techThread = new TechThread();
    const designThread = new DesignThread();

    /**
     * Observers are instanciated for each user and we're
     * passing the subjects needed to each observer.
     **/
    new TechThreadObserver(techThread, { userId: 1 });
    new TechThreadObserver(techThread, { userId: 2 });
    new TechThreadObserver(techThread, { userId: 3 });

    new DesignThreadObserver(designThread, { userId: 1 });
    new DesignThreadObserver(designThread, { userId: 2 });
    new DesignThreadObserver(designThread, { userId: 3 });
}

init();
