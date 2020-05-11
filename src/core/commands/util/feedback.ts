import { Message, TextChannel } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({ usage: "<feedback:string>" })
export default class extends Command {
  public async run(message: Message, [feedback]: [string]) {
    const channel = this.client.channels.cache.get("709365852402876428");

    await (channel as TextChannel).send(
      this.client
        .embed(message)
        .setDescription(feedback)
        .addField("• Info", `**Guild**: ${message.guild.name} \`(${message.guild.id})\``)
    );

    return message.reply(message.t("util.feedback.sent"));
  }
}
