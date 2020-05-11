import { Message } from "discord.js";
import { Command, Event } from "klasa";
import { stripIndents } from "common-tags";

export default class ArgumentErrorEvent extends Event {
  public run(message: Message, command: Command, params: any[], error: string) {
    const { name, usageString: usage } = command;
    return message
      .reply(
        stripIndents`
        **${name.capitalize()}**'s Usage: \`ky!${name} ${usage.replace(
          /:[\w.?]+/gi,
          ""
        )}\`
        - ${error}
        `
      )
      .catch((err) => this.client.logger.error(err));
  }
}
