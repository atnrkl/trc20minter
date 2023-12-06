const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");

export async function POST(request) {
  const data = await request.json();
  const { privateKey, memo } = data;
  console.log(data);
  if (!privateKey || !memo) {
    throw new Error("Private key or memo is missing");
  }
  console.log(request.body);
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  const blackHole = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"; // Black hole address

  try {
    const unSignedTxn = await tronWeb.transactionBuilder.sendTrx(blackHole, 1); // 0.000001 TRX is the minimum transfer amount.
    const unSignedTxnWithNote = await tronWeb.transactionBuilder.addUpdateData(
      unSignedTxn,
      memo,
      "utf8"
    );
    const signedTxn = await tronWeb.trx.sign(unSignedTxnWithNote);
    console.log("signed =>", signedTxn);
    const ret = await tronWeb.trx.sendRawTransaction(signedTxn);
    console.log("broadcast =>", ret);
    return Response.json(ret);
  } catch (err) {
    console.log("error:", err);
  }
}
