// inspired by https://github.com/ericand1/worker-storage

enum WorkerStorageAction {
	GetItem = "getItem",
	SetItem = "setItem",
	Clear = "clear",
	RemoveItem = "removeItem",
	Length = "length",
	Key = "key",
};

export class WorkerStorage {
	private readonly worker: Worker;

	constructor() {
		if (window?.Worker === undefined || window?.Worker === null) {
			throw new Error("window.Worker is undefined, this library is only available in browser applications, if this is running in a browser please ensure you are using a browser supporing web workers.");
		}

		const workerBlob = new Blob([ "" ], { type: "text/javascript" });
		this.worker = new Worker(window.URL.createObjectURL(workerBlob));
	}

	private createEventPromiseWrapper<T>(action: WorkerStorageAction, key?: string, payload?: T): Promise<T | undefined | null> {
		return new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				clearInterval(interval);
				reject(new Error("No response from worker received"));
				this.worker.onmessage = null;
				clearInterval(interval);
			}, 500);

			this.worker.onmessage = (event) => {
				if (event.data.action !== action) {
					reject(new Error(`Received unexpected action ${event.data.action} in getItem function, have you awaited the calls?`));
				} else {
					switch (action) {
						case WorkerStorageAction.GetItem:
						case WorkerStorageAction.Length:
						case WorkerStorageAction.Key:
							resolve(event.data.payload);
						default:
							resolve(null);
					}

					clearInterval(interval);
					this.worker.onmessage = null;
				}
			};

			this.worker.postMessage({ action, key, payload });
		});
	}
};
