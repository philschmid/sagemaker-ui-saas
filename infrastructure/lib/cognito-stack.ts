import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { IdentityPool, UserPoolAuthenticationProvider } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { Duration } from 'aws-cdk-lib';
import * as fs from 'fs';
import * as path from 'path';

export interface CognitoStackProps extends cdk.StackProps {
  readonly name: string;
}

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: `${props.name}-userpool`,
      selfSignUpEnabled: true,
      signInAliases: {
        username: false,
        email: true,
      },
      autoVerify: { email: true },
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up to our awesome app! Your verification code is {####}',
      },
      standardAttributes: {
        // fullname: {
        //   required: true,
        //   mutable: false,
        // },
        // address: {
        //   required: false,
        //   mutable: true,
        // },
      },
      customAttributes: {
        'isManaged': new cognito.StringAttribute({ minLen: 1, maxLen: 15, mutable: false }),
        'customerCode': new cognito.StringAttribute({ minLen: 1, maxLen: 2048, mutable: true }),
      },
    });


    const userPoolClient = userPool.addClient('app-client', {
      userPoolClientName: `${props.name}-app-client`,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
      refreshTokenValidity: Duration.days(30),
    });

    const identityPool = new IdentityPool(this, 'identityPool', {
      identityPoolName: `${props.name}-identityPool`,
      authenticationProviders: {
        userPools: [new UserPoolAuthenticationProvider({ userPool, userPoolClient })],
      },
    });

    new cdk.CfnOutput(this, 'CognitoUserPoolId', {
      value: userPool.userPoolId,
      exportName: 'CognitoUserPoolId'
    });
    new cdk.CfnOutput(this, 'CognitoAppClientId', {
      value: userPoolClient.userPoolClientId,
      exportName: 'CognitoAppClientId'
    });

    new cdk.CfnOutput(this, 'CognitoIdentityPoolId', {
      value: identityPool.identityPoolId,
      exportName: 'CognitoIdentityPoolId'
    });
    new cdk.CfnOutput(this, 'Region', {
      value: this.region,
      exportName: 'Region'
    });
  }
}
