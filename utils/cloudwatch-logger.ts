// utils/cloudwatch-logger.ts
import {
    CloudWatchLogsClient,
    PutLogEventsCommand,
    CreateLogStreamCommand,
  } from "@aws-sdk/client-cloudwatch-logs";
  import { randomUUID } from "crypto";
  
  const LOG_GROUP_NAME = process.env.SELF_HEAL_LOG_GROUP;
  const AWS_REGION = process.env.AWS_REGION ?? "us-east-1";
  
  if (!LOG_GROUP_NAME) {
    throw new Error("Missing required environment variable: SELF_HEAL_LOG_GROUP");
  }
  
  const client = new CloudWatchLogsClient({ region: AWS_REGION });
  const logStreamName = `run-${randomUUID()}`;
  let streamCreated = false;
  
  async function ensureLogStream() {
    if (streamCreated) return;
    try {
      await client.send(
        new CreateLogStreamCommand({
          logGroupName: LOG_GROUP_NAME,
          logStreamName,
        })
      );
    } catch (err: any) {
      if (err.name !== "ResourceAlreadyExistsException") throw err;
    }
    streamCreated = true;
  }
  
  export async function logSelectorFailure(
    testName: string,
    locatorStrategy: string,
    errorMessage: string
  ) {
    await ensureLogStream();
    await client.send(
      new PutLogEventsCommand({
        logGroupName: LOG_GROUP_NAME,
        logStreamName,
        logEvents: [
          {
            message: JSON.stringify({
              testName,
              selector: locatorStrategy,
              error: errorMessage,
              timestamp: Date.now(),
            }),
            timestamp: Date.now(),
          },
        ],
      })
    );
  }