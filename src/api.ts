interface StartHiccupRecorderEvent {
    type: "start";
    resolutionMs: number;
    reportingIntervalMs: number;
}

interface RecordHiccupEvent {
    type: "record";
    deltaTimeMicrosec: number;
}

interface StopHiccupRecorderEvent {
    type: "stop";
}

type Event = StartHiccupRecorderEvent | RecordHiccupEvent | StopHiccupRecorderEvent;

export {
    StartHiccupRecorderEvent,
    RecordHiccupEvent,
    StopHiccupRecorderEvent,
    Event
}