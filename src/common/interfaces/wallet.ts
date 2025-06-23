export interface IWallet {
	id: string;
	userId: string;
    walletAddress: string;
    balance: number;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
