import {
  Stack,
  StackProps,
  CfnOutput,
  aws_s3 as s3,
  aws_iam as iam,
  aws_route53 as route53,
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  Duration,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_route53_targets as route53Targets,
  aws_s3_deployment as s3Deploy,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { DOMAIN_NAME, REPO_NAME } from "../environment";

const ACCOUNT_ID = process.env.CDK_DEFAULT_ACCOUNT || '';

export class HmsInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, "HmsZone", {
      domainName: DOMAIN_NAME,
    });

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${DOMAIN_NAME}`,
      }
    );
    new CfnOutput(this, "Site", { value: "https://" + DOMAIN_NAME });

    const hmsBucket = new s3.Bucket(this, "HmsApp", {
      bucketName: `${ACCOUNT_ID}-hms-frontend`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    hmsBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [hmsBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );
    new CfnOutput(this, "Bucket", { value: hmsBucket.bucketName });

    const certificate = new acm.DnsValidatedCertificate(
      this,
      "HmsCertificate",
      {
        domainName: DOMAIN_NAME,
        hostedZone: zone,
        region: "us-east-1",
      }
    );
    new CfnOutput(this, "Certificate", { value: certificate.certificateArn });

    const distribution = new cloudfront.Distribution(this, "HmsDistribution", {
      certificate: certificate,
      defaultRootObject: "index.html",
      domainNames: [DOMAIN_NAME],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
          ttl: Duration.minutes(30),
        },
      ],
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(hmsBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: DOMAIN_NAME,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

    new s3Deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3Deploy.Source.asset("../hms-app/build")],
      destinationBucket: hmsBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    const role = new iam.Role(this, "HmsGithubOidcRole", {
      assumedBy: new iam.WebIdentityPrincipal(
        `arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub": [
              `repo:idealo/${REPO_NAME}:*`,
            ],
          },
        }
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });
    new CfnOutput(this, "GithubOidcRoleArn", {
      value: role.roleArn,
    });
  }
}
