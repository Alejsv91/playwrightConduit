// utils/cloudwatch-logger.ts
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { randomUUID } from "crypto";

const client = new CloudWatchLogsClient({ region: "us-east-1" });
const logStreamName = `run-${randomUUID()}`;
let streamCreated = false;

async function ensureLogStream() {
  if (streamCreated) return;
  const { CreateLogStreamCommand } = await import("@aws-sdk/client-cloudwatch-logs");
  try {
    await client.send(new CreateLogStreamCommand({
      logGroupName: "/playwright/selector-failures",
      logStreamName,
    }));
  } catch (err: any) {
    if (err.name !== "ResourceAlreadyExistsException") throw err;
  }
  streamCreated = true;
}

export async function logSelectorFailure(testName: string, selector: string, error: string) {
  await ensureLogStream();
  const command = new PutLogEventsCommand({
    logGroupName: "/playwright/selector-failures",
    logStreamName,
    logEvents: [
      {
        message: JSON.stringify({ testName, selector, error, timestamp: Date.now() }),
        timestamp: Date.now(),
      },
    ],
  });
  await client.send(command);
}