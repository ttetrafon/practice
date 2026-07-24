const { Stack, Duration } = require('aws-cdk-lib');
const { DockerImageFunction, DockerImageCode, Architecture } = require('aws-cdk-lib/aws-lambda');

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    let lambdaFunction = new DockerImageFunction(
      this,
      'LambdaDockerFunction',
      {
        code: DockerImageCode.fromImageAsset('lib/docker'),
        architecture: Architecture.ARM_64
      }
    );
  }
}

module.exports = { CdkStack }
