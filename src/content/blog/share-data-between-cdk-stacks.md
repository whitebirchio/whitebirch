---
title: 'Share Data Between CDK Stacks'
updatedDate: '2024-01-30'
slug: 'share-data-between-cdk-stacks'
description: 'How to share data between CDK stacks using the SSM parameter store.'
hero: '/images/aws-cdk.png'
tags: ['cdk', 'ssm', 'parameter store']
layout: '../../layouts/BlogPostLayout.astro'
---

When working with AWS CDK, you may find yourself needing to share data between stacks. A common use case for this is when you have a stack that creates a resource, and another stack that needs to access that resource by name or ARN.

This can be done using the SSM Parameter Store. The SSM Parameter Store is a service that allows you to store data in a key-value pair format. This data can then be accessed by other AWS services, such as Lambda, EC2, and of course, CDK.

In this article, we'll go over how to share data between CDK stacks using the SSM Parameter Store.

## Create a new CDK stack

First, let's create a new CDK stack. We'll use TypeScript for this example, but you can use any language that CDK supports.

```bash
cdk init app --language typescript
```

This will create a new CDK app with a single stack. We'll create a new stack to share data with.

```bash
cdk create ShareDataStack
```

This will create a new stack called `ShareDataStack` in the `lib` directory.

## Create a parameter in the SSM Parameter Store

Next, we'll create a parameter in the SSM Parameter Store. We'll use the `StringParameter` construct to create a new parameter. We will set its value to the ARN of a S3 bucket that we want to share between stacks.

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class ShareDataStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'SomeBucket', {
      bucketName: 'some-bucket',
    });

    new ssm.StringParameter(this, 'SomeBucketArn', {
      parameterName: '/arns/some-bucket',
      stringValue: api.bucketArn,
    });
  }
}
```

This will create a new parameter in the SSM Parameter Store with the name `/arns/some-bucket` and the value of the ARN of the S3 bucket we created.

## Access the parameter in another stack

Now that we have a parameter in the SSM Parameter Store, we can access it in another stack. We'll create a new stack called `AccessDataStack` and access the parameter we created in the `ShareDataStack`.

```bash
cdk create AccessDataStack
```

This will create a new stack called `AccessDataStack` in the `lib` directory.

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class AccessDataStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const arn = ssm.StringParameter.fromStringParameterName(
      this,
      'SomeBucketArn',
      '/arns/some-bucket'
    );

    const bucket = s3.Bucket.fromBucketArn(this, 'SomeBucket', arn.stringValue);

    console.log('Bucket Name:', bucket.bucketName);
  }
}
```

This will access the ARN of the S3 bucket we created in the `ShareDataStack` and obtain a reference to the bucket.

## Deploy the stacks

Now that we have our stacks created, we can deploy them to AWS.

```bash
cdk deploy ShareDataStack
cdk deploy AccessDataStack
```

This will deploy the `ShareDataStack` and `AccessDataStack` to AWS. Once deployed, you should see the bucket name logged to the console.

## Conclusion

In this article, we went over how to share data between CDK stacks using the SSM Parameter Store. The SSM Parameter Store is a powerful service that allows you to store data in a key-value pair format and access it from other AWS services. This can be useful when working with CDK and needing to share data or resources between stacks.

I hope you found this article helpful. If you have any questions or comments, please feel free to [reach out](mailto:scott@whitebirch.io).

Happy coding! 🚀
