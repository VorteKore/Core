import { IData } from "../interfaces/IData";
import { VorteClient } from "./VorteClient";
import { Message } from "discord.js";
import { VorteGuild } from "./VorteGuild";

export class Command {
  bot: VorteClient;
  name: string;
  aliases: string[];
  category: string;
  usage: string;
  description: string | undefined;
  example: string | undefined;
  cooldown: number;
  constructor(bot: VorteClient, data: IData) {
    this.bot = bot;
    this.name = data.name;
    this.aliases = data.aliases || [];
    this.category = data.category || "Main";
    this.usage = data.usage || this.name;
    this.description = data.description;
    this.example = data.example;
    this.cooldown = data.cooldown || 0;
  }
  run(message: Message, args: string[] | string, guild: VorteGuild) {
    console.log("This command isnt added yet!");
  }
}