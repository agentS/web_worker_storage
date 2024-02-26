# Web Worker Storage

This module provides an asynchronous web storage compatible wrapper around a web worker storing entries in an IndexedDB. This module can be used from both TypeScript and JavaScript code.

## Example Usage

```js
(async () => {
    const myWebWorkerStorage = new WebWorkerStorage.WorkerStorage();

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
