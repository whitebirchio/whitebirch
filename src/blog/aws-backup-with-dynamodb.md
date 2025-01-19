---
title: 'The Hidden Dangers of AWS Backup with DynamoDB'
updatedDate: '2025-01-18'
description: 'Using AWS Backup with DynamoDB and the hidden dangers of doing so.'
hero: '/images/aws-cdk-environments.png'
tags: ['aws', 'backup', 'dynamodb', 'aws backup']
---

The scope of this article is to provide a high-level overview of how to setup AWS Backup with DynamoDB and the cost implications of doing so. There are some hidden landmines to be mindful of when setting up backups for DynamoDB. The purpose of this article aims to provide some guidance on how to navigate them.

## What is AWS Backup?

[AWS Backup](https://aws.amazon.com/backup/) is a fully managed backup service that makes it easy to centralize and automate the backup of data across AWS services. It provides a simple, cost-effective way to backup your data and recover it when needed.

AWS Backup supports a wide range of AWS services, including EBS volumes, RDS databases, Aurora databases, DocumentDB databases, DynamoDB tables, and more. It allows you to create backup plans, set retention policies, and monitor backup activity across your AWS environment.

## Setting up AWS Backup with DynamoDB

To set up AWS Backup with DynamoDB, you need to create a backup plan that includes the DynamoDB table you want to back up. You can do this through the AWS Backup console or the AWS CLI.

Here's an example of how to create a backup plan for a DynamoDB table using the AWS CLI:

```bash
aws backup create-backup-plan --backup-plan-name my-backup-plan --backup-plan-rule '{"RuleName": "my-backup-rule", "TargetBackupVaultName": "my-backup-vault", "ScheduleExpression": "cron(0 0 * * ? *)", "StartWindowMinutes": 60, "CompletionWindowMinutes": 60, "Lifecycle": {"DeleteAfterDays": 30}}' --backup-plan-tags Key=Environment,Value=Production --resources "arn:aws:dynamodb:us-west-2:123456789012:table/my-dynamodb-table"
```

This command creates a backup plan named `my-backup-plan` with a backup rule that backs up the DynamoDB table `my-dynamodb-table` every day at midnight. The backups are stored in the backup vault `my-backup-vault` and are retained for 30 days.

## The Hidden Danger

Most data storage services support incremental backups, where only the changes since the last backup are stored. However, DynamoDB does not support incremental backups. When you create a backup plan for a DynamoDB table, AWS Backup creates a backup of the entire table, not just the changes since the last backup.

Consider our example above, where we are backing up a DynamoDB table every day at midnight and retaining the backups for 30 days. Let's say the table contains 500 GB of data. Each backup will be 500 GB in size, and over the course of 30 days, you will have 30 backups, each 500 GB in size. That's a total of 15 TB of backup data!

As of writing this article, the [cost of DynamoDB backups is $0.10 per GB-month](https://aws.amazon.com/backup/pricing/). So, in our example, the cost of backing up a 500 GB table daily for 30 days would be:

```plaintext
$0.10/GB-month * 500 GB * 1 backup/day * 30 days = $1,500
```

You may have expected the cost to be much lower. It may seem like a 500 GB table backup at a rate of $0.10/GB-month would be $50. However, since DynamoDB backups are full backups and not incremental, the cost quickly adds up.

## Real-World Example

To put this into perspective, let's consider a real-world scenario.

Last year, the enterprise I was working for rolled out a broad and sweeping AWS Backup strategy for all data storage services. There were a handful of backup policies that would be applied based on the level of importance of the data. The most stringent policy was to perform a backup hourly and retain the backups for 35 days. The least stringent policy was to perform a backup daily and retain the backups for 35 days.

My team in particular had a few DynamoDB tables that totaled around 300 GB in size. According the my organizations policy, our tables required a daily backup with 35-day retention.

Being good citizens of our organizational policies, we adopted the backup policy on our DynamoDB tables without much thought. We were aware that there would be a cost associated to the backups, but we assumed the cost had been properly considered from those who had established the policy. Boy, were we wrong!

After a few weeks, we noticed that our AWS bill had increased significantly. For one month, my team's entire AWS bill was approximately $31,000 and the backup costs alone were approximately $10,000! Said another way, the backup costs alone were 32% of our total AWS bill! And this was before we had even reached the 35-day retention period, so the costs were only going to increase.

We quickly realized that the backup costs were unsustainable...and this was just for our team which only makes up a small fraction of the enterprise. We did some back-of-napkin math and estimated that the DynamoDB backup costs for the entire enterprise would be in the millions of dollars annually!

We immediately disabled the backup policies for our DynamoDB tables and alerted our leadership team to the issue. The backup policies were quickly revised, and the costs were brought back under control.
