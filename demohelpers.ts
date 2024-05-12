import { Data } from "effect";
import { services } from "./services";

export class PublishSuccessMsg extends Data.TaggedClass("PublishSuccessMsg")<{
  message: string;
}> {}

export const demoState = {
  pageId: "abc",
  raceCondition: false,
  pagelocked: false,
  databaselocked: false,
  user: {
    id: "abc",
    roleId: "7y4387",
  },
};

export const context = {
  services,
  user: demoState.user,
};
