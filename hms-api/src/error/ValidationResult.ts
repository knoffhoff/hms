/* eslint-disable require-jsdoc */

export default class {
  failures = [] as string[]

  addFailure(failure: string): void {
    this.failures.push(failure)
  }

  toBulletList(): string {
    return this.failures.join('\n- ')
  }

  hasFailed(): boolean {
    return this.failures.length > 0
  }
}
