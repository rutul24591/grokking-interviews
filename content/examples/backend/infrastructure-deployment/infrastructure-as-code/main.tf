provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_instance" "web" {
  ami           = "ami-123456"
  instance_type = "t3.micro"
  subnet_id     = aws_vpc.main.id
}