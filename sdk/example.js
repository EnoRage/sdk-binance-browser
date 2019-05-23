let TESTNET_ENDPOINT_ASIA = "https://testnet-dex-asiapacific.binance.org";
let TESTNET_ENDPOINT_DEFAULT = "https://testnet-dex.binance.org";

const getBaseClient = () => {
    return new bnbBrowser.bnbBrowser(TESTNET_ENDPOINT_ASIA);
};

const getClient = async (useAwaitSetPrivateKey = true, doNotSetPrivateKey = false, mnemonic) => {
    const client = new bnbBrowser.bnbBrowser(TESTNET_ENDPOINT_ASIA);
    await client.initChain();
    const privateKey = bnbBrowser.bnbBrowser.crypto.getPrivateKeyFromMnemonic(mnemonic);
    if (!doNotSetPrivateKey) {
        if (useAwaitSetPrivateKey) {
            await client.setPrivateKey(privateKey);
        } else {
            client.setPrivateKey(privateKey);
        }
    }
    client.useDefaultSigningDelegate();
    client.useDefaultBroadcastDelegate();
    return client
};

// Create private key
async function CreateKey() {
    const client = await getBaseClient();
    const pk = bnbBrowser.bnbBrowser.crypto.generatePrivateKey();
    const res = client.recoverAccountFromPrivateKey(pk);
    console.log(res)
}

// Create Mnemonic
async function getMnemonic() {
    const client = await getBaseClient();
    return client.createAccountWithMneomnic();
}

async function getAddressFromMnemonic(mnemonic) {
    let prvtKey = bnbBrowser.bnbBrowser.crypto.getPrivateKeyFromMnemonic(mnemonic);
    return bnbBrowser.bnbBrowser.crypto.getAddressFromPrivateKey(prvtKey);
}

// Returns list of all tokens on address
async function getBalance(address) {
    const client = await getClient(false);
    return await client.getBalance(address);
}

// Create a simple tx
// to - address to
// sum - sum (1 is 1 BNB)
// symbol - token symbol
// message - additional message to transfer
// returns txHash
async function sendTx(to, sum, symbol = "BNB", message = "Frontend Tx") {
    const client = await getClient(true);
    const addr = bnbBrowser.bnbBrowser.crypto.getAddressFromPrivateKey(client.privateKey);

    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`);
    const sequence = account.result && account.result.sequence;

    res = await client.transfer(addr, to, sum, symbol, message, sequence);
    return res.result[0].hash
}

// CreateOrder
// symbol - exchange symbol (like 000-EF6_BNB)
// type - sell or buy
// amount - 1 is 1 BNB
// price = price :)
async function createOrder(symbol, type, amount, price) {
    var final = 0;
    if (type === "sell") {
        final = 2;
    } else if (type === "buy") {
        final = 1
    }
    TESTNET_ENDPOINT_ASIA = "https://testnet-dex.binance.org";

    const client = await getClient(true);
    const addr = bnbBrowser.bnbBrowser.crypto.getAddressFromPrivateKey(client.privateKey);
    const accCode = bnbBrowser.bnbBrowser.crypto.decodeAddress(addr);
    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`);
    const sequence = account.result && account.result.sequence;
    return await client.placeOrder(addr, symbol, final, price, amount, sequence)
}

async function markets() {
    const client = await getClient(true);
    return await client.getMarkets(150);
}
