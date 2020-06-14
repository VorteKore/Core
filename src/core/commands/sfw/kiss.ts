import { GuildMember, Message } from "discord.js";
import { Command, CommandOptions } from "klasa";
import { Init } from "../../../lib";

@Init<CommandOptions>({
  description: (t) => t.get("sfw.kiss"),
  usage: "[target:member]",
})
export default class BakaCommand extends Command {
  public async run(message: Message, [ target ]: [ GuildMember ]) {
    const image = await this.client.apis.api("nekos").kiss;
    if (!image) return message.reply("Sorry, I couldn't find anything.");

    return message.send(
      this.client
        .embed(message)
        .setDescription(`${message.member} kisses ${target ?? "me 😘"}`)
        .setImage(image)
    );
  }
}
