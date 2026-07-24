# Attributes

- In general, attributes lead into creating DOM properties when the html document is parsed.
- Attributes are manipulated through the `element.*Attribute()` methods (*: `set`, `get`, `remove`).
- Properties are manipulated through the `element.property` accessor.
- Updates in an attribute propagate in updates in the corresponding property and vice versa.
  - Exception are the `.value`, `.selected`, and `.checked` properties of inputs/selectors. An update in the property does not update the attribute, which still keeps the original value.

```js
let input = document.querySelector('input');
input.setAttribute('value', 'initialValue');

input.value = 'newValue';
console.log(input.getAttribute('value') == input.value ); // -> false
```
