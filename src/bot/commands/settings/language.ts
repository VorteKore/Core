import { Message } from "discord.js";
import {
  Command,
  confirm,
  getLanguageKeys,
  Language,
  KyflxEmbed
} from "../../../lib";

export default class extends Command {
  public constructor() {
    super("language", {
      aliases: ["guild-lang", "lang"],
      description: t => t("cmds:conf.lang.desc"),
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          id: "lang",
          type: (_: Message, phrase: string) => {
            if (!phrase) return null;
            const types = getLanguageKeys(_);
            if (!types.some(t => t.some(_t => _t.ignoreCase(phrase))))
              return null;

            const id = types.find(t => t.some(_t => _t.includes(phrase)))[0];
            return _.client.i18n.languages.get(id);
          }
        }
      ]
    });
  }

  public async exec(message: Message, { lang }: { lang: Language }) {
    if (!lang) {
      const embed = new KyflxEmbed(message).baseEmbed();
      for (const language of message.client.i18n.languages.values())
        embed.addField(language.displayName, language.aliases.join(", "), true);
      return message.util.send(embed);
    }

    const confirmation = await confirm(
      message,
      message.t("cmds:conf.lang.confirm", { lang })
    );

    if (!confirmation)
      return message.sem(message.t("cmds:conf.lang.cancelled"));

    await this.updateDb(message.guild, "language", lang.id);
    return message.sem(message.t("cmds:conf.lang.res", { lang }));
  }
}
