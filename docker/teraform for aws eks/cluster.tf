################################################################################
# EKS
################################################################################

module "eks_cluster" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.19"

  cluster_name    = "${local.name}-cluster"
  cluster_version = "1.30"

  cluster_endpoint_public_access = true

  # EKS Addons
  cluster_addons = {
    coredns                = { most_recent = true }
    eks-pod-identity-agent = { most_recent = true }
    kube-proxy             = { most_recent = true }
    vpc-cni                = { most_recent = true }
  }

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_group_defaults = {
    instance_types = ["t3.medium"]

    min_size     = 1
    max_size     = 1
    desired_size = 1

    attach_cluster_primary_security_group = true

    capacity_type = "SPOT"
  }

  eks_managed_node_groups = {
    soda-demo-api = {}
    soda-demo-ps  = {}
    soda-demo-ps  = {}
  }

  tags = local.tags
}
