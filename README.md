# Web Worker Storage

![NPM Version](https://img.shields.io/npm/v/web_worker_storage)

This module provides an asynchronous [WebStorage](https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface) compatible wrapper around a web worker storing entries in an IndexedDB. This module can be used from both TypeScript and JavaScript code.

The goal of this module was to provide a more secure way of storing OIDC token and the library has been tested with the [oidc-client-ts library](https://www.github.com/authts/oidc-client-ts). By storing the OIDC token in a web worker, XSS attacks are prevented from accessing it. Aside from using a different storage backend, no more modifications are required.

## Example Usage

### Integration with oidc-client-ts

```ts
import { WebWorkerStorage } from "web_storage_worker";
import { UserManagerSettings, WebStorageStateStore, UserManager } from "oidc-client-ts";

const oidcWebWorkerStorage = new WebWorkerStorage();
const settings: UserManagerSettings = {
	// ...
	stateStore: new WebStorageStateStore({ store: oidcWebWorkerStorage }),
	userStore: new WebStorageStateStore({ store: oidcWebWorkerStorage }),
};
const userManager = new UserManager(settings);
```

### Programatic usage as an NPM package

```js
import { WebWorkerStorage } from "web_storage_worker";

(async () => {
	const myWebWorkerStorage = new WebWorkerStorage();

	await myWebWorkerStorage.setItem("myKey", "myValue");
	let myRetrievedValue = await myWebWorkerStorage.getItem("myKey");
	console.log("retrieved value: " + myRetrievedValue);

	console.log("size: " + (await myWebWorkerStorage.length));
	await myWebWorkerStorage.setItem("mySecondKey", "mySecondValue");
	console.log("size: " + (await myWebWorkerStorage.length));

	console.log("key 0: " + (await myWebWorkerStorage.key(0)));
	console.log("key 1: " + (await myWebWorkerStorage.key(1)));

	await myWebWorkerStorage.removeItem("mySecondKey");
	console.log("size after removal: " + (await myWebWorkerStorage.length));

	await myWebWorkerStorage.clear();
	console.log("size after clearing: " + (await myWebWorkerStorage.length));
})();
```
