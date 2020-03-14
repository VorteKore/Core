import { Message, Role } from "discord.js";
import { Command, VorteEmbed } from "../../../lib";

export default class PlayerRole extends Command {
  public constructor() {
    super("mafia-player-role", {
      aliases: ["mafia-player", "mafia-player-role"],
      description: t => t("cmds:conf.play.desc"),
      args: [
        {
          id: "player",
          type: "role",
          otherwise: (_: Message) =>
            new VorteEmbed(_).setDescription(_.t("cmds:conf.play.cur", { _ }))
        }
      ],
      channel: "guild",
      userPermissions: "MANAGE_GUILD"
    });
  }

  public async exec(message: Message, { player }: { player: Role }) {
    const guild = message._guild.games.mafia;

    guild.playerRole = player.id;
    await message._guild.save();

    return message.sem(message.t("cmds:conf.play.new", { player }));
  }
}
