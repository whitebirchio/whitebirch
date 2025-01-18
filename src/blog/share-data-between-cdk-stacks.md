---
title: 'Share Data Between CDK Stacks'
updatedDate: '2024-01-30'
description: 'How to share data between CDK stacks using the SSM parameter store.'
hero: '/images/aws-cdk-sharing-data.png'
tags: ['cdk', 'ssm', 'parameter store']
---

When working with AWS CDK, you may find yourself needing to share data between stacks. A common use case for this is when you have a stack that creates a resource, and another stack that needs to access that resource by name or ARN.

This can be done using the SSM Parameter Store. The SSM Parameter Store is a service that allows you to store data in a key-value pair format. This data can then be accessed by other AWS services, such as Lambda, EC2, and of course, CDK.

In this article, we'll go over how to share data between CDK stacks using the SSM Parameter Store.

## Create a parameter in the SSM Parameter Store

First, let's assume we have a stack called `ShareDataStack` that creates an S3 bucket. We want to share the ARN of this bucket with another stack.

We'll create a parameter in the SSM Parameter Store. We'll use the `StringParameter` construct to create a new parameter. We will set its value to the ARN of a S3 bucket that we want to share between stacks.

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

Now that we have a parameter in the SSM Parameter Store, we can access it in another stack called `AccessDataStack`. We'll use the `StringParameter.fromStringParameterName` method to obtain a reference to the parameter.

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

## Conclusion

In this article, we went over how to share data between CDK stacks using the SSM Parameter Store. The SSM Parameter Store is a powerful service that allows you to store data in a key-value pair format and access it from other AWS services. This can be useful when working with CDK and needing to share data or resources between stacks.

I hope you found this article helpful. If you have any questions or comments, please feel free to [reach out](mailto:scott@whitebirch.io).

Happy coding! 🚀
