import HttpClient from "./HttpClient";

class MockCheckout extends HttpClient {
  constructor() {
    super("https://dev-userspace-be-production.up.railway.app");
  }

  submitPurchase = async (data: {
    subscriptionId: string;
    subscriptionType: "public" | "private";
    subscriptionPeriod: "monthly" | "quarterly" | "yearly";
    subscriptionStatus: "active";
    subscriptionEndDate: string;
    email: string;
    password: string;
    profileUsername: string;
    amountUSD: string;
    amount: string;
    currency: string;
  }) => this.post("/webhook-compat", { type: "init-purchase", data }, { headers: { "Content-Type": "application/json", Accept: "*/*" } });
}

export default MockCheckout;
