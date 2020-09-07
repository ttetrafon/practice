import Subject from './Subject.js';

class TechThread extends Subject {
    constructor() {
        super();

        this.bindArticlePost();
    }

    bindArticlePost() {
        /* Saves the "Post on Tech" button as well as the input text */
        const postTechBtn = document.querySelector('.js-post-tech');
        const jsTechText = document.querySelector('.js-tech-text');

        /* notifies that new information was post when clicking the post button */
        postTechBtn.addEventListener('click', () => {
            this.notify(jsTechText.value);
        });
    }
}

export default TechThread;
