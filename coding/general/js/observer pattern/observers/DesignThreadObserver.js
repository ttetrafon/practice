class DesignThreadObserver {
    constructor(designThread, { userId }) {
        this.userContainer = document.querySelector(`.js-user-${userId}`);
        this.userUpdates = this.userContainer.querySelector('.js-updates');

        this._bindEvents(designThread);
    }

    _bindEvents(designThread) {
        const subDesignBtn = this.userContainer.querySelector('.js-sub-design');
        const unsubDesignBtn = this.userContainer.querySelector(
            '.js-unsub-design'
        );
        const designSubStatus = this.userContainer.querySelector(
            '.js-stat-design'
        );

        subDesignBtn.addEventListener('click', e => {
            designSubStatus.classList.add('active');
            designSubStatus.innerHTML = 'Subscribed to design';

            designThread.subscribe(this);        });
        unsubDesignBtn.addEventListener('click', e => {
            designSubStatus.classList.remove('active');
            designSubStatus.innerHTML = 'Unsubscribed to design';

            designThread.unsubscribe(this);        });
	}

	update(data) {
		const listElement = document.createElement('li');
		listElement.innerHTML = `[Design Post] - ${data}`;
		this.userUpdates.appendChild(listElement);
	}}

export default DesignThreadObserver;
