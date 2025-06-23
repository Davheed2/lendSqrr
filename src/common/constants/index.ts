export enum Role {
	SuperUser = 'superuser',
	User = 'user',
	Guest = 'guest',
}

export enum TransactionStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	FAILED = 'failed',
}

export enum TransactionType {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
	TRANSFER = 'transfer',
}
