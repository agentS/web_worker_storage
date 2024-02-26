// inspired by https://github.com/ericand1/worker-storage

import workerCode from "./web_worker.txt";

enum WorkerStorageAction {
	GetItem = "getItem",
	SetItem = "setItem",
	Clear = "clear",
	RemoveItem = "removeItem",
	Length = "length",
	Key = "keyAt",
};

export class WebWorkerStorage {
	private readonly worker: Worker;

	constructor() {
		if (window?.Worker === undefined || window?.Worker === null) {
			throw new Error("window.Worker is undefined, this library is only available in browser applications, if this is running in a browser please ensure you are using a browser supporing web workers.");
		}

		// console.log("---");
		// console.log(workerCode);
		// console.log("---");
		const workerBlob = new Blob([ workerCode ], { type: "text/javascript" });
		this.worker = new Worker(window.URL.createObjectURL(workerBlob));
	}

	key(index: number): Promise<string> {
		return this.createEventPromiseWrapper(WorkerStorageAction.Key, index) as Promise<string>;
	}

	setItem(key: string, value: any): Promise<void> {
		return this.createEventPromiseWrapper(WorkerStorageAction.SetItem, key, value);
	}

	getItem<T>(key: string): Promise<T> {
		return this.createEventPromiseWrapper(WorkerStorageAction.GetItem, key) as Promise<T>;
	}

	removeItem(key: string): Promise<void> {
		return this.createEventPromiseWrapper(WorkerStorageAction.RemoveItem, key) as Promise<void>;
	}

	clear(): Promise<void> {
		return this.createEventPromiseWrapper(WorkerStorageAction.Clear) as Promise<void>;
	}

	get length(): Promise<number> {
		return this.createEventPromiseWrapper(WorkerStorageAction.Length) as Promise<number>;
	}

	private createEventPromiseWrapper<T>(action: WorkerStorageAction, key?: string | number, payload?: T): Promise<T | undefined | null> {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				// console.log("clearing interval due to timeout");
				clearTimeout(timeout);
				reject(new Error("No response from worker received"));
				this.worker.removeEventListener("message", listener);
				clearTimeout(timeout);
			}, 500);

			const listener = (event: MessageEvent<any>) => {
				if (event.data.action !== action) {
					reject(new Error(`Received unexpected action ${event.data.action} in getItem function, have you awaited the calls?`));
				} else {
					switch (action) {
						case WorkerStorageAction.GetItem:
						case WorkerStorageAction.Length:
						case WorkerStorageAction.Key:
							// console.log("resolving to " + event.data.payload);
							resolve(event.data.payload);
						default:
							// console.log("resolving to null");
							resolve(null);
					}

					clearTimeout(timeout);
					this.worker.removeEventListener("message", listener);
				}
			}
			this.worker.addEventListener("message", listener);

			// console.log("posting message to worker");
			this.worker.postMessage({ action, key, payload });
		});
	}
};
