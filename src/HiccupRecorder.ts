import { Event, RecordHiccupEvent, StartHiccupRecorderEvent, StopHiccupRecorderEvent } from "./api"

class HiccupRecorder {

    private recorderLoop: any;
    
    constructor(private worker: Worker, public writer = (line: string) => console.log(line), private resolutionMs = 100, private reportingIntervalMs = 5000) {

    }

    start() {
        const startEvent: StartHiccupRecorderEvent = {
            type: "start",
            resolutionMs: this.resolutionMs,
            reportingIntervalMs: this.reportingIntervalMs
        }
        this.worker.onmessage = (event) => { this.writer(event.data) };
        this.worker.postMessage(startEvent);
        let timeBeforeMeasurement = performance.now();
        this.recorderLoop = setInterval(() => {
            const timeAfterMeasurement = performance.now();
            const recordEvent: RecordHiccupEvent = {
                type: "record",
                deltaTimeMicrosec: (timeAfterMeasurement - timeBeforeMeasurement) * 1000
            }          
            this.worker.postMessage(recordEvent);
            timeBeforeMeasurement = timeAfterMeasurement;
        }, this.resolutionMs)
    }

    stop() {
        clearInterval(this.recorderLoop);
        this.worker.postMessage({
            type: "stop"
        });
    }
}

export default HiccupRecorder;