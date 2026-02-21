# Authentication & Authorisation

## Authentication

- confirm the user's identity

### Basic Auth

- username and password
- needs to be wrapped in https for basic security

### Bearer Tokens

- header `Bearer <token>`
- fast & stateless approach

### OAuth2

- login through external services (Google, GitHub, etc)

### JWT Tokens

- cookie `<JWT>` used for authenticating each request from the user
- token created after logging in through some other method

### Access & Refresh Tokens

- cookies, created after login
- Access
  - used for authenticating each request from the user
  - short-lived
- Refresh:
  - used to recreate the access token without logging in again
  - long-lived

### SSO & Identity Protocols

## Authorisation

- defines users' operation boundaries

### RBAC (Role Based Access Control)

- assign roles; e.g.: admin, editor, viewer
- each role has a defined permission boundary

### ABAC (Attribute Based Access Control)

- based on user and/or resource attributes
- define boundaries through combinations of attributes
  - e.g.: user.department == 'HR' && data.type == 'payroll'

### ACL (Access Control List)

- each resource has its own permission list
