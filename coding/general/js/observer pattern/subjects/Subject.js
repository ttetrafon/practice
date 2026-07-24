class Subject {
    constructor() {
        /**
         * The list of threads observed based on each user's instance.
         * this will contain a list of observers.
         */
        this.observers = [];
    }

    isSubscribed(f) {
        /* Help us check if the observer for an user is already subscribed */
        return this.observers.filter(subscriber => subscriber === f).length;
    }

    subscribe(f) {
        /* Verifies that the user is not subscribed already */
        if (this.isSubscribed(f)) return;

        /* If the user is not subscribed adds the function to the list */
        this.observers.push(f);
    }

    unsubscribe(f) {
        /**
         * returns a new array of functions without the one passed as argument,
         * Basically unsubscribing the user from that thread.
         */
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    notify(data) {
        /**
         * notifies the user, it passes the data to each observer
         * set in the list so that it's updated.
         */
        this.observers.forEach(observer => observer.update(data));
    }
}

export default Subject;