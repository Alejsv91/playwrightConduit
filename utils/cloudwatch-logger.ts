import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const client = new CloudWatchLogsClient({ region: "us-east-1" });
const logStreamName = `run-${process.env.GITHUB_RUN_ID ?? crypto.randomUUID()}`;

export async function logSelectorFailure(testName: string, selector: string, error: string) {
  const command = new PutLogEventsCommand({
    logGroupName: "/playwright/selector-failures",
    logStreamName: logStreamName,
    logEvents: [
      { message: JSON.stringify({ testName, selector, error, timestamp: Date.now() }), timestamp: Date.now() },
    ],
  });
  await client.send(command);
}