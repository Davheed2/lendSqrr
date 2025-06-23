export interface ITransaction {
	id: string;
	userId: string;
    senderId: string;
    receiverId: string;
    walletAddress: string;
    amount: number;
    transactionType: 'deposit' | 'withdraw' | 'transfer';
    status: 'pending' | 'completed' | 'failed';
    reference: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
