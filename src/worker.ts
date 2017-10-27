import { Recorder, HistogramLogWriter } from "hdr-histogram-js";
import {
  Event,
  RecordHiccupEvent,
  StartHiccupRecorderEvent,
  StopHiccupRecorderEvent
} from "./api";

let resolutionMicrosec: number;
let reporter: any;
const recorder = new Recorder();
let histogram = recorder.getIntervalHistogram();

const handleStart = (event: StartHiccupRecorderEvent) => {
  const writer = new HistogramLogWriter(postMessage.bind(self));
  writer.outputLogFormatVersion();
  writer.outputComment("jsHiccup v1.0");
  writer.outputComment("Timestamp and interval length are in seconds");
  writer.outputComment("Hiccup measures, including max, are in ms");
  writer.outputLegend();
  recorder.reset();
  resolutionMicrosec = event.resolutionMs * 1000;
  reporter = self.setInterval(() => {
    histogram = recorder.getIntervalHistogram(histogram);
    writer.outputIntervalHistogram(histogram);
  }, event.reportingIntervalMs);
};

let shortestObservedDeltaTimeMicrosec = Number.MAX_SAFE_INTEGER;
const handleRecord = ({ deltaTimeMicrosec }: RecordHiccupEvent) => {
  if (deltaTimeMicrosec < shortestObservedDeltaTimeMicrosec) {
    shortestObservedDeltaTimeMicrosec = deltaTimeMicrosec;
  }
  const hiccupTimeMicrosec = Math.round(
    deltaTimeMicrosec - shortestObservedDeltaTimeMicrosec
  );
  recorder.recordValueWithExpectedInterval(
    hiccupTimeMicrosec,
    resolutionMicrosec
  );
};

const handleStop = (event: StopHiccupRecorderEvent) => {
  clearInterval(reporter);
};

onmessage = (e: MessageEvent) => {
  const event = e.data as Event;
  switch (event.type) {
    case "start":
      handleStart(event);
      break;
    case "record":
      handleRecord(event);
      break;
    case "stop":
      handleStop(event);
      break;
    default:
      const error: never = event;
  }
};
