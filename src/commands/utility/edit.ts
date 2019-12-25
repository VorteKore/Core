import { Command } from "../../lib/classes/Command";
import { VorteClient, VorteEmbed, VorteMessage } from "../../lib";
import { Message } from "discord.js";
import { checkPermissions } from "../../util";

export default class extends Command {
  public constructor() {
    super("edit", {
      category: "Utility",
      cooldown: 0,
      description: "Edits an embed",
      usage: "!edit MessageID Title | Description",
      example: "!edit 648491057318723584 This is the title | This is the Description",
      channel: "guild",
      userPermissions: "ADMINISTRATOR"
    });
  }

  public async run(message: VorteMessage, args: string[]) {
    if (!args[0]) return message.sem("Please provide message id to edit the message.");
      
    const d = args.slice(1).join(" ").split(" | ");

    message.channel.messages.fetch(args[0]).then(msg => {
      msg.edit(new VorteEmbed(message).baseEmbed().setTitle(d[0]).setDescription(d[1]).setFooter(`Editted On ${Date.now()}`));
    });
  }
};