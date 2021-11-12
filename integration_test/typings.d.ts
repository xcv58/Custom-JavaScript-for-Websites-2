import 'jest'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R
    }
  }
  interface Window {
    _: any;
    ace: any;
  }
}
