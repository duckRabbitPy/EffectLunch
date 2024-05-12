import { Effect, Schedule, pipe, Logger, LogLevel } from "effect";
import { context, demoState } from "./demohelpers";

const retryPolicy = Schedule.addDelay(
  Schedule.recurs(2), // Retry for a maximum of 2 times
  () => "100 millis" // Add a delay of 100 milliseconds between retries
);

const PublishPage = (pageId: string) => {
  const { services, user } = context;

  return pipe(
    services.getRoleById(user.roleId),
    Effect.flatMap((role) => {
      return services.validatePermissions(role);
    }),
    Effect.flatMap((role) => {
      return services.generateNewPageTag(pageId, role);
    }),
    Effect.flatMap((pageTag) => {
      return services.generatePDF(pageId, pageTag);
    }),
    Effect.flatMap((pdfResult) => {
      return services.getSubscribers(pdfResult.pageTag);
    }),
    Effect.flatMap((subscribers) => {
      return Effect.zip(
        services.sendEmailNotifications(subscribers),
        services.sendInAppNotification(subscribers)
      );
    }),
    Effect.flatMap(([emailResult, inAppResult]) => {
      return Effect.log(`sent ${emailResult}, ${inAppResult}`);
    }),
    // hover over error to see the possible error types ❌ !!
    Effect.mapError((error) => {
      if (error._tag === "PageTagRaceConditionError") {
        return Effect.logDebug("Race condition error");
      }
      return error;
    })
  )
    .pipe(Effect.retry(retryPolicy))
    .pipe(Logger.withMinimumLogLevel(LogLevel.Debug));
};

const Main = () => {
  Effect.runPromise(PublishPage(demoState.pageId));
};
