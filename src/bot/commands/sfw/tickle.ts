import { GuildMember, Message } from "discord.js";
import { Command, get, Nekos, SFW_LINKS, KyflxEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("tickle", {
      aliases: ["tickle"],
      description: t => t("cmds:sfw.tickle.desc"),
      args: [
        {
          id: "member",
          default: (_: Message) => _.guild.me,
          type: "member"
        }
      ]
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    const { data, error } = await get<Nekos>(SFW_LINKS.tickle);
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    return message.util.send(
      new KyflxEmbed(message)
        .setDescription(`***${message.author}** starts tickling **${member}***`)
        .setImage(data.url)
    );
  }
}
