import crypto from "crypto";

type Block = {
	index: number;
	timestamp: string;
	transactions: any[];
	previousHash: string;
	nonce: string;
	hash: string;
};

type Transaction = {
	sender: string;
	recipient: string;
	data: any;
};

type Host = any;

export default class Blockchain {
	private chain: Block[];
	private pendingTransactions: Transaction[];
	private peers: Set<Host>;

	constructor() {
		this.chain = [];
		this.pendingTransactions = [];
		this.peers = new Set();
		this.newBlock();
	}

	/**
	 * Adds a node to our peer table
	 */
	addPeer(host: Host) {
		this.peers.add(host);
	}

	/**
	 * Adds a node to our peer table
	 */
	getPeers() {
		return Array.from(this.peers);
	}

	/**
	 * Creates a new block containing any outstanding transactions
	 */
	newBlock(previousHash = undefined, nonce = null) {
		let block = {
			index: this.chain.length,
			timestamp: new Date().toISOString(),
			transactions: this.pendingTransactions,
			previousHash,
			nonce,
			hash: undefined
		};

		block.hash = Blockchain.hash(block);

		console.log(`Created block ${block.index}`);

		// Add the new block to the blockchain
		this.chain.push(block);

		// Reset pending transactions
		this.pendingTransactions = [];
	}

	/**
	 * Generates a SHA-256 hash of the block
	 */
	static hash(block: Block) {
		const blockString = JSON.stringify(block, Object.keys(block).sort());
		return crypto.createHash("sha256").update(blockString).digest("hex");
	}

	/**
	 * Returns the last block in the chain
	 */
	private lastBlock() {
		return this.chain.length && this.chain[this.chain.length - 1];
	}

	/**
	 * Determines if a hash begins with a "difficulty" number of 0s
	 *
	 * @param hashOfBlock: the hash of the block (hex string)
	 * @param difficulty: an integer defining the difficulty
	 */
	static powIsAcceptable(hashOfBlock: string, difficulty: number) {
		return hashOfBlock.slice(0, difficulty) === "0".repeat(difficulty);
	}

	/**
	 * Generates a random 32 byte string
	 */
	static nonce() {
		return crypto
			.createHash("sha256")
			.update(crypto.randomBytes(32))
			.digest("hex");
	}

	/**
	 * Proof of Work mining algorithm
	 *
	 * We hash the block with random string until the hash begins with
	 * a "difficulty" number of 0s.
	 */
	mine(blockToMine = null, difficulty = 4) {
		const block = blockToMine || this.lastBlock();

		while (true) {
			block.nonce = Blockchain.nonce();
			if (Blockchain.powIsAcceptable(Blockchain.hash(block), difficulty)) {
				console.log("We mined a block!");
				console.log(` - Block hash: ${Blockchain.hash(block)}`);
				console.log(` - nonce:      ${block.nonce}`);
				return block;
			}
		}
	}
}
