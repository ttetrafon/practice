# Global Infrastructure

- Isolated **regions** all over the world, each split in multiple **availability zones (AZ)**. Both regions and AZs are independent of each other; no data replication happens automatically between them. AZs in the same region are connected with fibre cables for efficient communication.
  - Services should be deployed in multiple AZs simultaneously for resiliency against failure scenarios.

# Core Technologies

- Compute
  - EC2 (Elastic Compute Service)
    - ELB (Elastic Load Balancing)
- Storage
  - S3 (Simple Storage Service): Attached to EC2 instances, but independent of them.
  - EBS (Elastic Block Store)
- Databases
  - RDS (Relational Database Service)
  - DynamoDB (NO-SQL DB)
  - ElastiCache
- Security
  - IAM (Identity and Access Management)
- Management
- Networking
  - VPC (Virtual Private Cloud): Build an isolated local network in the cloud.
    - Flow Log: Logs all network communication within the VPC
    - Security Groups: Control access to resource instances - up to 5 security groups assigned to a single instance.
    - NACL (Network Access Control Lists): Control access to subnets.
  - Route 53: Route end users to internet applications.
