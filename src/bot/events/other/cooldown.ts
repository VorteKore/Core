import { Message } from "discord.js";
import { Command, Listener } from "../../../lib";

export default class CooldownListener extends Listener {
  public constructor() {
    super("command-cooldown", {
      event: "cooldown",
      emitter: "commands"
    });
  }

  public async exec(message: Message, _: Command, remaining: number) {
    return message.sem(message.t("evts:cmds.cooldown", { remaining }), {
      type: "error"
    });
  }
}
