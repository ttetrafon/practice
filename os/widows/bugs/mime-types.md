# Mime-Types

- Installations may corrupt/change the mime-types assigned to various extensions.
- These can be fixed in the registry directly, under `HKEY_CLASSES_ROOT\.***` or `HKEY_LOCAL_MACHINE\SOFTWARE\Classes\.***`.
- This is useful for programs that try to figure out how to use the files in question.

*For example, the AWS CLI uses the mime-type from the registry when synchronising files to S3; files uploaded in S3 with the wrong mime-type may cause issues in serverless applications.*
