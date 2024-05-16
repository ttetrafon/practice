# Code Testing

Testing should be automated as much as possible, and run often, usually after every major change (adding features, bug fixing, deployments, etc) in the codebase.

The following test steps are useful in all apps, regardless of size.

1. Unit: Checks specific parts of the code (usually at a function and class level) for expected outputs.
2. Regression: Ensures new code hasn't broken existing functionality.
3. API/Integration: Validates full interactions within the codebase (e.g.: API endpoint).
4. UI: Tests interface and input for expected behaviour.
5. Security: Checks authorisation behaviour and common attack vectors.
6. Performance: Measures the system's performance.
