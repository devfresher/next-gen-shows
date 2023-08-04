import { Paystack } from 'paystack-sdk';
import {
	InitializeTransaction,
	Transaction,
	TransactionInitialized,
} from 'paystack-sdk/dist/transaction/interface';
import { SystemError } from '../errors';
import { config } from './config';

class PaystackUtil {
	private paystack: Paystack;

	constructor(secret: string) {
		this.paystack = new Paystack(secret);
	}

	async initializePayment(
		amountInKobo: string,
		email: string,
		metadata: any,
		callback_url: string
	): Promise<TransactionInitialized> {
		try {
			const paymentArgs: InitializeTransaction = {
				amount: amountInKobo,
				metadata,
				email,
				callback_url,
			};

			const response = await this.paystack.transaction.initialize(paymentArgs);
			if (response.data === null) throw response;

			return response;
		} catch (error) {
			throw new SystemError(500, 'Error initializing payment', error);
		}
	}

	async verifyPayment(reference: string): Promise<Transaction> {
		try {
			const response = await this.paystack.transaction.verify(reference);
			if (response.data === null) throw response;

			return response.data;
		} catch (error) {
			throw new SystemError(500, 'Error verifying payment', error);
		}
	}
}

export default new PaystackUtil(config.PAYSTACK_SECRET_KEY);
