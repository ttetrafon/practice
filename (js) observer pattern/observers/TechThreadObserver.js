class TechThreadObserver {
    /**
     * We get the subject techThread and the userId that will observe
     * that particular thread.
     */
    constructor(techThread, { userId }) {
        /* Container for each user based on the ID*/
        this.userContainer = document.querySelector(`.js-user-${userId}`);

        /* Section that will receive the updates from the threads */
        this.userUpdates = this.userContainer.querySelector('.js-updates');

        this._bindEvents(techThread);
    }

    _bindEvents(techThread) {
        /* These two buttons will allow us to add listeners to subscribe/unsubscribe */
        const subTechBtn = this.userContainer.querySelector('.js-sub-tech');
        const unsubTechBtn = this.userContainer.querySelector('.js-unsub-tech');

        /* little grey box that shows if the user is currently subscribed to Tech */
        const techSubStatus = this.userContainer.querySelector('.js-stat-tech');

        /* Add the listener to the button subscribe to tech */
        subTechBtn.addEventListener('click', e => {
            /* Subscribes to the thread */
            techThread.subscribe(this);
            /* Update the status of the user to reflect it's subscribed */
            techSubStatus.classList.add('active');
            techSubStatus.innerHTML = 'Subscribed to tech';
        });
        unsubTechBtn.addEventListener('click', e => {
            /* Unsubscribes to the thread */
            techThread.unsubscribe(this);
            /* Update the status of the user to reflect it's not subscribed */
            techSubStatus.classList.remove('active');
            techSubStatus.innerHTML = 'Unsubscribed to tech';
        });
    }

    /**
     * Function which will be in charge of updating each user when
     * a new post from tech is added, this function is invoked by the Subject class
     * when the notify method is called.
     */
    update(data) {
		const listElement = document.createElement('li');
		listElement.innerHTML = `[Tech Post] - ${data}`;
		this.userUpdates.appendChild(listElement);
	}}

export default TechThreadObserver;
