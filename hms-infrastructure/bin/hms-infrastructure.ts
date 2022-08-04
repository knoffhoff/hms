#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HmsInfrastructureStack } from "../lib/hms-infrastructure-stack";

const app = new cdk.App();

new HmsInfrastructureStack(app, "HmsInfrastructureStack", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1' },
});
