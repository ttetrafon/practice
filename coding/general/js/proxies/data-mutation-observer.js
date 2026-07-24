function createObservable(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      if (target[prop] !== value) {
        onChange(prop, value);
      }
      return Reflect.set(target, prop, value, receiver);
    },
    get(target, prop, receiver) {
      const value = target[prop];
      if (value instanceof Function) {
        return function(...args) {
          return value.apply(this === receiver ? target : this, args);
        };
      }
      return value;
    },
    deleteProperty(target, prop) {
      onChange(prop, undefined);
      return Reflect.deleteProperty(target, prop);
    }
  });
}

const data = {
  name: "Anna",
  age: 30
};
const listeners = [];

const observedData = createObservable(data, (property, newValue) => {
  console.log(`Property '${property}' changed to:`, newValue);
  listeners.forEach(listener => listener(property, newValue));
});

function addListener(listener) {
  listeners.push(listener);
}

function myListener(property, newValue) {
  console.log(`Custom listener: Property '${property}' was updated.`);
}
addListener(myListener);

observedData.name = "Bob";
observedData.age++;
delete observedData.age;

addListener((prop, val) => console.log(`Another listener: ${prop} - ${val}`));
observedData.city = "New York";
