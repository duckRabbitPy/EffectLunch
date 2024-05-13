import { Effect } from "effect";

import {
  RoleNotFoundError,
  PermissionDeniedError,
  PDFGenerationError,
  SubscribersNotFoundError,
  EmailNotificationError,
  PageTagRaceConditionError,
  PageLockedError,
  DatabaseLockedError,
  InAppNotificationError,
} from "./errors";
import { demoState } from "./demohelpers";

// dummy services class
export class services {
  static getRoleById(_id: string) {
    const asyncDBCall = async () => {
      return {
        id: "7y4387",
        name: "admin",
        email: "demo@demo",
      } as Role;
    };

    return Effect.tryPromise({
      try: () => asyncDBCall(),
      catch: () => new RoleNotFoundError({ message: "Role not found" }),
    });
  }

  static validatePermissions(role: Role) {
    const asyncDBCall = async () => {
      if (role.id === "7y4387") {
        return role;
      }
      throw new Error();
    };

    return Effect.tryPromise({
      try: () => asyncDBCall(),
      catch: () => new PermissionDeniedError({ message: "Permission denied" }),
    });
  }

  static generatePDF(pageId: string, pageTag: PageTag) {
    const asyncPDFCall = async () => {
      return { pdf: "pdf", pageTag };
    };
    return Effect.tryPromise({
      try: () => asyncPDFCall(),
      catch: () => new PDFGenerationError({ message: "Error generating PDF" }),
    });
  }
  static getSubscribers(pageTag: PageTag) {
    const asyncDBCall = async () => {
      return ["sub1", "sub2"];
    };

    return Effect.tryPromise({
      try: () => asyncDBCall(),
      catch: () =>
        new SubscribersNotFoundError({ message: "Subscribers not found" }),
    });
  }
  static sendEmailNotifications(recipientId: string[]) {
    const asyncEmailCall = async () => {
      return "sentIds";
    };

    const sendSingleEmail = () => {
      return Effect.tryPromise({
        try: () => asyncEmailCall(),
        catch: () =>
          new EmailNotificationError({ message: "Error sending email" }),
      }).pipe(Effect.retry({ times: 2 }))
    };

    return Effect.forEach(recipientId, sendSingleEmail).pipe(Effect.withConcurrency(3))
  }

  static generateNewPageTag(
    pageId: string,
    role: Role
  ): Effect.Effect<
    PageTag,
    PageTagRaceConditionError | PageLockedError | DatabaseLockedError,
    never
  > {
    if (demoState.pagelocked) {
      return Effect.fail(new PageLockedError({ message: "Page is locked" }));
    }

    if (demoState.raceCondition) {
      return Effect.fail(
        new PageTagRaceConditionError({ message: "Page tag" })
      );
    }
    if (demoState.databaselocked) {
      return Effect.fail(
        new DatabaseLockedError({ message: "Database is locked" })
      );
    }

    return Effect.succeed({ id: "abc" } as PageTag);
  }

  static sendInAppNotification(subscribers: string[]) {
    const asyncInAppCall = async () => {
      return "inApp";
    };

    return Effect.tryPromise({
      try: () => asyncInAppCall(),
      catch: () =>
        new InAppNotificationError({
          message: "Error sending inApp notification",
        }),
    });
  }
}
