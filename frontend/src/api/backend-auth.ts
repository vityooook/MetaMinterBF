import { Account, TonProofItemReplySuccess } from "@tonconnect/ui-react";
import { config } from "~/config.ts";

export class BackendAuthService {
  private localStorageKey = "auth_jwt";
  public authorized = false;
  public accessToken: string | undefined = undefined;
  public readonly refreshIntervalMs = 9 * 60 * 1000;

  constructor() {
    this.accessToken = localStorage.getItem(this.localStorageKey) || undefined;
    this.authorized = this.accessToken != undefined;
  }

  async generatePayload() {
    const response = await (
      await fetch(`${config.apiUrl}/api/generate-payload`, {
        method: "POST",
      })
    ).json();

    return response.payload as string;
  }

  async checkProof(proof: TonProofItemReplySuccess["proof"], account: Account) {
    try {
      const reqBody = {
        address: account.address,
        network: account.chain,
        proof: {
          ...proof,
          state_init: account.walletStateInit,
        },
      };

      const checkProof = await (
        await fetch(`${config.apiUrl}/api/check-proof`, {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      const token = checkProof.token;
      localStorage.setItem(this.localStorageKey, token);
      this.accessToken = token;

      return checkProof.token;
    } catch (e) {
      this.authorized = false;
      console.log("checkProof error:", e);
    }
  }

  reset() {
    this.accessToken = undefined;
    localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
    this.authorized = false;
  }
}

export const BackendAuth = new BackendAuthService();
