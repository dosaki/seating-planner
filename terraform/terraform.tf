terraform {
  backend "s3" {
    encrypt = true
    bucket = "tiago-websites-tf-state-files"
    region = "eu-west-1"
    key = "seating-space-planner.dosaki.net/terraform.tfstate"
  }
}
