import { get, set, clear, del, keys } from "idb-keyval";

interface StorageMessage {
	identifier: string;
	action: string;
	key?: string | number;
	payload?: string;
}

const myWebWorker = () => {
	onmessage = async (message) => {
		// console.log("worker received message");

		const storageMessage: StorageMessage = message.data;
		if (storageMessage.identifier === undefined || storageMessage.identifier === null) {
			throw new Error("Invalid message identifier provided, please provider a unique ID.");
		}
		if (storageMessage.action === undefined || storageMessage.action === null) {
			throw new Error("Invalid worker message payload, action is required.");
		}

		const result: any = {
			identifier: structuredClone(storageMessage.identifier),
			completed: true,
			action: structuredClone(storageMessage.action),
		};

		switch (storageMessage.action) {
			case "getItem":
				if (storageMessage.key === undefined || storageMessage.key === null) {
					throw new Error("getItem requires a key!");
				}

				result.payload = await get(storageMessage.key);
				break;
			case "setItem":
				if (storageMessage.key === undefined || storageMessage.key === null) {
					throw new Error("setItem requires a key!");
				}

				await set(storageMessage.key, storageMessage.payload);
				break;
			case "clear":
				await clear();
				break;
			case "removeItem":
				if (storageMessage.key === undefined || storageMessage.key === null) {
					throw new Error("removeItem requires a key!");
				}

				await del(storageMessage.key);
				break;
			case "length":
				result.payload = (await keys()).length;
				break;
			case "keyAt":
				if (storageMessage.key === undefined || storageMessage.key === null) {
					throw new Error("keyAt requires a key!");
				}

				const sortedKeys = (await keys()).sort();
				result.payload = sortedKeys[storageMessage.key as number];
				break;
			default:
				throw new Error(`The worker does not support the action '${storageMessage.action}'`);
		}
		// console.log("posting message");
		// console.log(result);
		postMessage(result);
	};
};

myWebWorker();
export default myWebWorker;
