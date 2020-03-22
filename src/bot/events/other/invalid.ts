import { Message } from "discord.js";
import { Listener } from "../../../lib";

export default class MessageInvalidListener extends Listener {
  public constructor() {
    super("message-invalid", {
      emitter: "commands",
      event: "messageInvalid"
    });
  }

  public async exec(message: Message) {
    if (
      [
        "bassboost",
        "bb",
        "leave",
        "stop",
        "nowplaying",
        "np",
        "pause",
        "play",
        "add",
        "queue",
        "q",
        "next",
        "remove",
        "repeat",
        "loop",
        "resume",
        "seek",
        "shuffle",
        "skip",
        "🚶",
        "🏃",
        "volume",
        "vol"
      ].includes(message.util.parsed.alias)
      && process.env.NODE_ENV === "production"
    ) {
      return message.sem(
        "Sorry, we're currently banned from youtube. If you would like to help us get a new vps, please visit our [patreon](https://www.patreon.com/user?u=24217294)"
      );
    }
  }
}
