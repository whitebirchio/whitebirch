---
title: 'Managing Environments in CDK'
updatedDate: '2024-02-01'
slug: 'managing-environments-in-cdk'
description: 'How to manage environments in CDK stacks.'
hero: '/images/aws-cdk-environments.png'
tags: ['cdk', 'environments']
layout: '../../layouts/BlogPostLayout.astro'
---

When working with AWS CDK, you may need to manage different environments such as dev, test, and prod. One way to accomplish this is by using the `context` feature in CDK.

## What is Context?

[Runtime context](https://docs.aws.amazon.com/cdk/v2/guide/context.html) is a feature in CDK that allows you to pass in key-value pairs to your CDK app. You can then access these key-value pairs in your CDK code.

## How to Set Environment Data in Context

If you have variables that change between environments, you can use context to manage these variables. For example, let's say you have an API that has a different domain name and certificate for each environment. You can define these variables in your `cdk.json` file and then access them in your CDK code.

In your `cdk.json` file, you can define different contexts for different environments. For example:

```json
{
  "app": "npx ts-node bin/index.ts",
  "context": {
    "development": {
      "canonicalName": "api.dev.example.com",
      "certificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
    },
    "test": {
      "canonicalName": "api.test.example.com",
      "certificateArn": "arn:aws:acm:us-east-1:098765432109:certificate/12345678-1234-1234-1234-098765432109"
    },
    "production": {
      "canonicalName": "api.example.com",
      "certificateArn": "arn:aws:acm:us-east-1:123123123123:certificate/12345678-1234-1234-1234-123123123123"
    }
  }
}
```

## How to Specify the Environment When Deploying

When deploying your CDK app, you can use the `--context` flag to specify the environment. For example:

```bash
cdk deploy --context env=development
```

## How to Access Environment Data in CDK Code

In your CDK code, you can access the `env` context variable to get the environment-specific data. For example:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const env = this.node.tryGetContext('env');
    const { canonicalName, certificateArn } = this.node.tryGetContext(env);

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      certificateArn
    );

    const api = new apigateway.RestApi(this, 'Api', {
      domainName: {
        domainName: canonicalName,
        certificate: certificate,
      },
    });
  }
}
```

In this example, we access the `env` context variable to get the current environment. We then use the environment-specific data to create an API Gateway domain name with a custom certificate.

## Conclusion

Using context in CDK is a powerful way to manage environments in your CDK app. It allows you to define environment-specific variables and access them in your CDK code. This can help you manage different environments succinctly and avoid hardcoding environment-specific data in your CDK code.

I hope you found this article helpful. If you have any questions or comments, please feel free to [reach out](mailto:scott@whitebirch.io).

Happy coding! 🚀
