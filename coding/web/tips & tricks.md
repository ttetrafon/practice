# Tips & Tricks

## Form Anti-Bot Protection

- Honeypot fields in forms
  - 'website': empty, non-required, hidden field, that bots may fill
  - 'confirm_email': (or similar) hidden, pre-filled, required field; if overwritten, means a bot has filled it
    - the initial value should be something unique, created, and stored in the backend, to verify that it hasn't been messed with

```html
<input id="confirm_email" name="confirm_email" size="40" class="hidden" tabindex="-1" aria-hidden="true" autocomplete="off" placeholder="Confirm your Email">
```
