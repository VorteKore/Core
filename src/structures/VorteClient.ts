import { Client, ClientOptions, Collection } from "discord.js";
import { Handler } from "./Handler";
import { Mute } from "./Mute";

export class VorteClient extends Client {
  commands: Collection<string, any>;
  aliases: Collection<string, string>;
  handler: Handler | undefined;
  constructor(options?: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.on("ready", () => {
      console.log(`${this.user!.username} is ready to rumble!`);
      setInterval(async () => {
        const mutes = await Mute.getAll();
        mutes.forEach(async (x: any) => {
          if (x.time <= Date.now()) {
            const guild = this.guilds.get(x.guildID);
            if (!guild) return Mute.deleteOne(x.guildID, x.userID);
            const member = guild.members.get(x.userID) || await guild.members.fetch(x.userID) || null;
            if (!member) return Mute.deleteOne(x.guildID, x.userID);
            const muteRole = guild.roles.find((x) => x.name.toLowerCase() === "muted");
            member.roles.remove(muteRole!).catch(null);
            return Mute.deleteOne(x.guildID, x.userID);
          }
        })
      }, 5000)
    })
  }
};