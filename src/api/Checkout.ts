import HttpClient from "./HttpClient";

class MockCheckout extends HttpClient {
  constructor() {
    super("https://dev-userspace-be-production.up.railway.app");
  }
}

export default MockCheckout;
