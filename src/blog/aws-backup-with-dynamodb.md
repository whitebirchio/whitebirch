---
title: 'The Hidden Dangers of AWS Backup with DynamoDB'
updatedDate: '2025-01-18'
description: 'Setting up AWS Backup with DynamoDB and the hidden dangers of doing so.'
hero: '/images/aws-cdk-environments.png'
tags: ['aws', 'backup', 'dynamodb', 'aws backup']
---

The scope of this article is to provide a high-level overview of how to setup AWS Backup with DynamoDB and the cost implications of doing so. There are some landmines to be mindful of when setting up backups for DynamoDB, and this article aims to provide some guidance on how to navigate them.

## What is AWS Backup?

[AWS Backup](https://aws.amazon.com/backup/) is a fully managed backup service that makes it easy to centralize and automate the backup of data across AWS services. It provides a simple, cost-effective way to backup your data and recover it when needed.

AWS Backup supports a wide range of AWS services, including EBS volumes, RDS databases, Aurora databases, DocumentDB databases, DynamoDB tables, and more. It allows you to create backup plans, set retention policies, and monitor backup activity across your AWS environment.

## Setting up AWS Backup with DynamoDB

To set up AWS Backup with DynamoDB, you need to create a backup plan that includes the DynamoDB table you want to back up. You can do this through the AWS Backup console or the AWS CLI.

Here's an example of how to create a backup plan for a DynamoDB table using the AWS CLI:

```bash
aws backup create-backup-plan --backup-plan-name my-backup-plan --backup-plan-rule '{"RuleName": "my-backup-rule", "TargetBackupVaultName": "my-backup-vault", "ScheduleExpression": "cron(0 0 * * ? *)", "StartWindowMinutes": 60, "CompletionWindowMinutes": 60, "Lifecycle": {"DeleteAfterDays": 30}}' --backup-plan-tags Key=Environment,Value=Production --resources "arn:aws:dynamodb:us-west-2:123456789012:table/my-dynamodb-table"
```
