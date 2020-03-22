import { Message, TextChannel } from "discord.js";
import { channelKeys, Command, logs } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("log", {
      aliases: ["log", "logs"],
      description: t => t("cmds:conf.logs.desc"),
      channel: "guild",
      userPermissions: ["MANAGE_GUILD"],
      *args(_: Message) {
        const action = yield {
          type: ["set", "enable", "disable", "reset"]
        };

        const value =
          !action || action === "reset"
            ? {}
            : action === "set"
            ? yield {
                type: "textChannel",
                prompt: {
                  start: _.t("cmds:conf.logs.set_prompt")
                }
              }
            : yield {
                type: "string",
                match: "rest",
                prompt: {
                  start: _.t("cmds:conf.logs.prompt")
                }
              };

        return { action, value };
      }
    });
  }

  public async exec(
    message: Message,
    {
      action,
      value
    }: {
      action: "reset" | "set" | "enable" | "disable";
      value: TextChannel | string;
    }
  ) {
    if (!action)
      return message.sem(
        message.t("cmds:conf.logs.curr", { message, channelKeys })
      );

    switch (action) {
      case "reset":
        Object.keys(message._guild.logs)
          .filter(k => !channelKeys.includes(k))
          // @ts-ignore
          .forEach(key => (message._guild.logs[key] = false));
        message._guild.channels.audit = "";

        await message.sem(message.t("cmds:conf.logs.reset"));
        return this.updateDb(
          message.guild,
          "channels",
          message._guild.channels
        );
      case "set":
        message._guild.channels.audit = (value as TextChannel).id;
        await message.sem(message.t("cmds:conf.logs.set", { message, value }));
        return this.updateDb(
          message.guild,
          "channels",
          message._guild.channels
        );
      case "disable":
      case "enable":
        const filtered =
          (value as string).toLowerCase() === "all"
            ? logs
            : value
                .toString()
                .split(",")
                .filter(t => logs.includes(t.trim()))
                .map(t => t.trim());
        if (!filtered.length)
          return message.sem(message.t("cmds:conf.logs.chief"));
        filtered.forEach(
          // @ts-ignore
          e => (message._guild.logs[e] = action !== "disable")
        );
        await message.sem(
          message.t("cmds:conf.logs.de", {
            filtered,
            action,
            all: value === "all"
          })
        );
        return this.updateDb(
          message.guild,
          "logs",
          message._guild.logs
        );
    }
  }
}
