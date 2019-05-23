import * as bnbBrowser from '../../bnbBrowser.js';
import {MAINNET_DEFAULT} from './endpoints';

class Client {
    static createReadClient(endpoint: string = MAINNET_DEFAULT): any {
        return new bnbBrowser.Binance(endpoint);
    }

    static async createClient(endpoint: string = MAINNET_DEFAULT, mnemonic?: string) {
        let client = bnbBrowser.Binance(endpoint);
        if (mnemonic) {
            let privateKey = bnbBrowser.Binance.crypto.getPrivateKeyFromMnemonic(mnemonic);
            await client.setPrivateKey(privateKey);
        }
        return client
    }
}