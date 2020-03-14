import { Message, TextChannel } from "discord.js";
import { Command, MafiaChannel, VorteEmbed } from "../../../lib";

export default class SetupBot extends Command {
  public constructor() {
    super("mafia-channels", {
      aliases: ["mafia-channels", "setup-mafia-channels"],
      description: t => t("cmds:conf.chan.desc"),
      channel: "guild",
      userPermissions: "MANAGE_GUILD",
      *args(message: Message) {
        const id = yield {
          type: ["daytime", "detective", "doctor", "mafia"],
          otherwise: new VorteEmbed(message).setDescription(
            message.t("cmds:conf.chan.cur", { message })
          )
        };

        return {
          id,
          channel: yield id
            ? {
                type: "textChannel",
                prompt: {
                  start: message.t("cmds:conf.chan.chan")
                }
              }
            : {}
        };
      }
    });
  }

  public async exec(
    message: Message,
    { id, channel }: { id: MafiaChannel; channel: TextChannel }
  ) {
    message._guild.games.mafia[id] = channel.id;
    await message._guild.save();
    return message.sem(message.t("cmds:conf.chan.set", { channel, id }));
  }
}
