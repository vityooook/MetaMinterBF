import { beginCell, Cell, Address, contractAddress } from "@ton/ton";

const OFF_CHAIN_CONTENT_PREFIX = 0x01;

export function flattenSnakeCell(cell: Cell) {
  let c: Cell | null = cell;

  let res = Buffer.alloc(0);

  while (c) {
    const cs = c.beginParse();
    if (cs.remainingBits === 0) {
      return res;
    }
    if (cs.remainingBits % 8 !== 0) {
      throw Error("Number remaining of bits is not multiply of 8");
    }

    const data = cs.loadBuffer(cs.remainingBits / 8);
    res = Buffer.concat([res, data]);
    c = c.refs && c.refs[0];
  }

  return res;
}

export function bufferToChunks(buff: Buffer, chunkSize: number) {
  const chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.subarray(0, chunkSize));
    buff = buff.subarray(chunkSize);
  }
  return chunks;
}

export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127);

  if (chunks.length === 0) {
    return beginCell().endCell();
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell();
  }

  let curCell = beginCell();

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];

    curCell.storeBuffer(chunk);

    if (i - 1 >= 0) {
      const nextCell = beginCell();
      nextCell.storeRef(curCell);
      curCell = nextCell;
    }
  }

  return curCell.endCell();
}

export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}

export function decodeOffChainContent(content: Cell) {
  const data = flattenSnakeCell(content);

  const prefix = data[0];
  if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
    throw new Error(`Unknown content prefix: ${prefix.toString(16)}`);
  }
  return data.slice(1).toString();
}

// todo: move to collection contract
// Function to build NFT collection content cell
export function buildCollectionContentCell(
  collectionContent: string,
  commonContent: string
): Cell {
  const encodedCollectionContent = encodeOffChainContent(collectionContent);

  const commonContentCell = beginCell();
  commonContentCell.storeBuffer(Buffer.from(commonContent));

  const contentCell = beginCell()
    .storeRef(encodedCollectionContent)
    .storeRef(commonContentCell.endCell());

  return contentCell.endCell();
}

export type CollectionPayload = {
  address: Address;
  stateInitBase64: string;
};

// todo: move to collection contract
// Main function to mint NFT collection
export async function generateCollectionPayload(args: {
  nftCollectionCodeHex: string;
  nftItemCodeHex: string;
  admin: Address;
  userOwner: Address;
  price: bigint; // Minimum price is 0.2 TON
  buyerLimit: number; // Limit on minting NFTs, if no limit then set to 0
  startTime: number; // Mint start time, 0 if no start time
  endTime: number; // Mint end time, 0 if no end time
  collectionContent: string; // Collection content
  itemContent: string; // Base path for item content
  itemContentJson: string; // e.g. "nft.json"
  commission: bigint; // Commission fee
}): Promise<CollectionPayload> {
  // Convert hex strings to Cell objects
  const nftCollectionCodeCell = Cell.fromBoc(
    Buffer.from(args.nftCollectionCodeHex, "hex")
  )[0];
  const nftItemCodeCell = Cell.fromBoc(
    Buffer.from(args.nftItemCodeHex, "hex")
  )[0];

  // Build the NFT collection data
  const collectionData = beginCell()
    .storeAddress(args.userOwner)
    .storeAddress(args.admin)
    .storeRef(
      beginCell()
        .storeRef(
          buildCollectionContentCell(
            args.collectionContent,
            args.itemContent
          )
        )
        .storeRef(
          beginCell().storeBuffer(Buffer.from(args.itemContentJson)).endCell()
        )
        .storeRef(nftItemCodeCell)
        .endCell()
    )
    .storeInt(-1, 8)
    .storeCoins(args.price)
    .storeUint(0, 32)
    .storeUint(args.buyerLimit, 32)
    .storeUint(args.startTime, 32)
    .storeUint(args.endTime, 32)
    .storeCoins(args.commission)
    .endCell();

  // Create state initialization
  const stateInit = beginCell()
    .storeUint(0, 2)
    .storeUint(1, 1)
    .storeUint(1, 1)
    .storeUint(0, 1)
    .storeRef(nftCollectionCodeCell)
    .storeRef(collectionData)
    .endCell();

  // Compute contract address
  const address = contractAddress(0, {
    code: nftCollectionCodeCell,
    data: collectionData,
  });

  // Convert state init cell to base64
  const stateInitBase64 = Buffer.from(stateInit.toBoc()).toString("base64");

  return { address, stateInitBase64 };
}


export function decodeContentItem(cell: Cell): string {
  const slice = cell.beginParse(); // Создаём Slice для работы с ячейкой
  const buffer = slice.loadBuffer(slice.remainingBits / 8); // Извлекаем буфер (размер в байтах)
  return buffer.toString("utf-8"); // Преобразуем Buffer в строку
}
