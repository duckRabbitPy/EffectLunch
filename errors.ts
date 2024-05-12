import { Data } from "effect";

export class PDFGenerationError extends Data.TaggedClass("PDFGenerationError")<{
  message: string;
}> {}

export class EmailNotificationError extends Data.TaggedClass(
  "EmailNotificationError"
)<{
  message: string;
}> {}

export class InAppNotificationError extends Data.TaggedClass(
  "InAppNotificationError"
)<{
  message: string;
}> {}

export class RoleNotFoundError extends Data.TaggedClass("RoleNotFoundError")<{
  message: string;
}> {}

export class UserNotFoundError extends Data.TaggedClass("UserNotFoundError")<{
  message: string;
}> {}

export class SubscribersNotFoundError extends Data.TaggedClass(
  "SubscribersNotFoundError"
)<{
  message: string;
}> {}

export class PermissionDeniedError extends Data.TaggedClass(
  "PermissionDeniedError"
)<{
  message: string;
}> {}

export class PageTagRaceConditionError extends Data.TaggedClass(
  "PageTagRaceConditionError"
)<{
  message: string;
}> {}

export class PageLockedError extends Data.TaggedClass("PageLockedError")<{
  message: string;
}> {}

export class DatabaseLockedError extends Data.TaggedClass(
  "DatabaseLockedError"
)<{
  message: string;
}> {}
