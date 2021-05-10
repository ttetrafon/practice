import Subject from './Subject.js';

class DesignThread extends Subject {
    constructor() {
        super();
        this.bindArticlePost();
    }

    bindArticlePost() {
        const postDesignBtn = document.querySelector('.js-post-design');
        const jsDesignText = document.querySelector('.js-design-text');

        postDesignBtn.addEventListener('click', () => {
            this.notify(jsDesignText.value);
        });
    }
}

export default DesignThread;
