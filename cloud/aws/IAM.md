# IAM

## Processes

### Admin User

- `IAM -> IAM User Groups -> Create Group`
  - Name: Administrators
  - Policy: **AdministratorAccess** (AWS Managed Work Policy)
- `IAM -> Users -> Create User`
  - **User Details**
    - Username: _email_
    - Provide user access to the AWS Management Console -> true
    - Autogenerate password & change at first login
  - **Permissions**
    - Add User to Group -> Administrators
