import { TonClient } from "@ton/ton";
import { getHttpEndpoint } from '@orbs-network/ton-access';

let cachedTonClient: TonClient | undefined = undefined;

async function getTonClient<T>(
  action: (client: TonClient) => Promise<T>
): Promise<T> {
  const apiKey = import.meta.env.VITE_TON_CLIENT_API_KEY;
  const endpoints = [
    async () => await getHttpEndpoint({ network: 'mainnet' })
  ];

  async function checkEndpoint(
    endpointFn: () => Promise<string>
  ): Promise<TonClient | undefined> {
    const endpoint = await endpointFn();
    console.log(`Attempting to connect to ${endpoint}`);

    const clientConfig = {
      endpoint,
      ...(apiKey ? { apiKey } : {}),
    };

    const tonClient = new TonClient(clientConfig);

    try {
      await tonClient.getMasterchainInfo();
      return tonClient;
    } catch (error) {
      console.error(
        `Failed to retrieve masterchain info from ${endpoint}:`,
        error
      );
      return undefined;
    }
  }

  if (cachedTonClient) {
    return await action(cachedTonClient);
  }

  for (let i = 0; i < endpoints.length; i++) {
    const tonClient = await checkEndpoint(endpoints[i]);
    if (tonClient) {
      cachedTonClient = tonClient;
      return await action(tonClient);
    }
  }

  throw new Error("No working endpoints found");
}

export { getTonClient };
