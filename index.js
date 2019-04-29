const rxjs = require("rxjs");
const op = require("rxjs/operators");

console.log("Starging NEXTUP")
const responses = ["OneRes", "TwoRes", "ThreeRes"];

executeAllRequests(responses).subscribe(x => console.log(x));

const requestDelay = 0;
function arraySpacerObservable(responses) {
    return rxjs.interval(0).pipe(op.take(responses.length), op.map(x => dummyHttpGetWithRetry(responses[x])), op.flatMap(x => x));
}

function executeAllRequests(responses) {
    const spacer = arraySpacerObservable(responses);
    spacer.subscribe(x => console.log("INNER MAGIC VERYDONE IS " + x));
    return rxjs.concat(spacer, rxjs.of("finished")).pipe(op.skip(responses.length));
}

const retries = 5;
function dummyHttpGetWithRetry(response) {
    return rxjs.interval(100).pipe(
        op.take(retries),
        op.concatMap(() => dummyHttpGet(response)),
        op.filter((x, i) => isValid(x, i)),
        op.take(1))
}

const requestDuration = 0;
function isValid(x, i) {
    return x != "RESPONSE TwoRes" || i == retries - 1; // last one goes through
}

function dummyHttpGet(response) {
    return new Promise((resolve, reject) => {
        setTimeout(function () { resolve("RESPONSE " + response); }, requestDuration);
    });
}
