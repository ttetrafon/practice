export const init = (selector, component) => {
    console.log("---> init()");
    const app = document.querySelector(selector);
    console.log("app: ", app);
    const newElement = document.createElement(component.type);
    console.log("newElement:", newElement);
    const newTextContent = document.createTextNode(component.template);
    console.log("newTextContent:", newTextContent);

    newElement.append(newTextContent);
    app.append(newElement);
    console.log("app: ", app);
};
